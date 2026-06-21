import { beforeEach, describe, expect, it, vi } from 'vitest';

type MessageCallback = (message: { body: string }) => void;

const stompState = {
  subscriptions: new Map<string, MessageCallback>(),
  published: [] as Array<{ destination: string; headers?: Record<string, string>; body: string }>
};

class MockClient {
  connected = false;
  onConnect?: () => void;
  onStompError?: (frame: { headers: Record<string, string> }) => void;
  onWebSocketError?: () => void;
  onWebSocketClose?: () => void;

  subscribe(destination: string, callback: MessageCallback) {
    stompState.subscriptions.set(destination, callback);
    return {
      unsubscribe: () => {
        stompState.subscriptions.delete(destination);
      }
    };
  }

  publish(frame: { destination: string; headers?: Record<string, string>; body: string }) {
    stompState.published.push(frame);
  }

  activate() {
    this.connected = true;
    this.onConnect?.();
  }
}

vi.mock('@stomp/stompjs', () => ({
  Client: MockClient
}));

vi.mock('./backendConfig', () => ({
  getBackendConfig: vi.fn(async () => ({
    appName: 'uChat',
    defaultLocale: 'en',
    webSocketEndpoint: '/ws',
    chatSendDestination: '/app/chat.send',
    chatMessageSubscription: '/user/queue/chat.messages',
    chatErrorSubscription: '/user/queue/chat.errors'
  })),
  resolveWebSocketUrl: vi.fn(() => 'ws://localhost:8080/ws')
}));

function emitTo(destination: string, payload: Record<string, unknown>) {
  const callback = stompState.subscriptions.get(destination);
  if (!callback) {
    throw new Error(`Missing subscription for ${destination}`);
  }
  callback({ body: JSON.stringify(payload) });
}

async function waitForSubscriptions(count: number) {
  for (let i = 0; i < 20; i += 1) {
    if (stompState.subscriptions.size >= count) {
      return;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
  throw new Error(`Expected at least ${count} subscriptions, got ${stompState.subscriptions.size}`);
}

describe('chatSocket concurrent mapping', () => {
  beforeEach(() => {
    vi.resetModules();
    stompState.subscriptions.clear();
    stompState.published.length = 0;
  });

  it('keeps successful response mapped to its own clientMessageId while rejecting matching pending on error', async () => {
    const { sendChatMessage } = await import('./chatSocket');

    const req1Promise = sendChatMessage({
      conversationId: 'conv-1',
      clientMessageId: 'client-1',
      content: 'hello-1',
      locale: 'en'
    });

    const req2Promise = sendChatMessage({
      conversationId: 'conv-1',
      clientMessageId: 'client-2',
      content: 'hello-2',
      locale: 'en'
    });

    await waitForSubscriptions(2);

    emitTo('/user/queue/chat.messages', {
      id: 'bot-2',
      clientMessageId: 'client-2',
      conversationId: 'conv-1',
      sender: 'bot',
      content: 'reply-2',
      timestamp: '2026-06-21T08:00:00Z'
    });

    await expect(req2Promise).resolves.toEqual(
      expect.objectContaining({
        id: 'bot-2',
        clientMessageId: 'client-2'
      })
    );

    emitTo('/user/queue/chat.errors', {
      code: 'CHAT_BAD_REQUEST',
      message: 'locale must be zh or en',
      clientMessageId: 'client-1',
      timestamp: '2026-06-21T08:00:01Z'
    });

    await expect(req1Promise).rejects.toThrow('locale must be zh or en');
  });

  it('rejects pending request when error payload breaks contract', async () => {
    const { sendChatMessage } = await import('./chatSocket');

    const reqPromise = sendChatMessage({
      conversationId: 'conv-1',
      clientMessageId: 'client-1',
      content: 'hello',
      locale: 'en'
    });

    await waitForSubscriptions(2);

    emitTo('/user/queue/chat.errors', {
      code: 'CHAT_BAD_REQUEST',
      clientMessageId: 'client-1',
      timestamp: '2026-06-21T08:00:01Z'
    });

    await expect(reqPromise).rejects.toThrow('Received invalid chat error payload.');
  });
});
