import { Client, type IMessage } from '@stomp/stompjs';
import { getBackendConfig } from './backendConfig';
import { resolveWebSocketUrl } from './endpoint';
import {
  parseChatErrorEvent,
  parseChatMessageEvent,
  type ChatErrorEvent,
  type ChatMessageEvent
} from './chatContract';

export interface ChatSendRequest {
  conversationId: string;
  clientMessageId: string;
  content: string;
  locale: 'en' | 'zh';
}

interface PendingRequest {
  clientMessageId: string;
  resolve: (message: ChatMessageEvent) => void;
  reject: (error: Error) => void;
  timeoutId: number;
}

const DEFAULT_CHAT_RESPONSE_TIMEOUT_MS = 30000;

function resolveChatResponseTimeoutMs(): number {
  const raw = import.meta.env.VITE_CHAT_RESPONSE_TIMEOUT_MS;
  if (!raw) {
    return DEFAULT_CHAT_RESPONSE_TIMEOUT_MS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_CHAT_RESPONSE_TIMEOUT_MS;
  }

  return parsed;
}

const CHAT_RESPONSE_TIMEOUT_MS = resolveChatResponseTimeoutMs();

class ChatSocketService {
  private client: Client | null = null;
  private configPromise: Promise<void> | null = null;
  private pendingRequests = new Map<string, PendingRequest>();

  async sendMessage(request: ChatSendRequest): Promise<ChatMessageEvent> {
    await this.connect();

    if (!this.client?.connected) {
      throw new Error('Chat connection is not ready.');
    }

    return new Promise<ChatMessageEvent>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.rejectPendingById(request.clientMessageId, 'Chat response timed out.');
      }, CHAT_RESPONSE_TIMEOUT_MS);

      this.pendingRequests.set(request.clientMessageId, {
        clientMessageId: request.clientMessageId,
        resolve,
        reject,
        timeoutId
      });

      this.client?.publish({
        destination: this.destination.chatSendDestination,
        headers: {
          'content-type': 'application/json',
          clientMessageId: request.clientMessageId
        },
        body: JSON.stringify(request)
      });
    });
  }

  private destination = {
    chatSendDestination: '/app/chat.send',
    chatMessageSubscription: '/user/queue/chat.messages',
    chatErrorSubscription: '/user/queue/chat.errors'
  };

  private async connect(): Promise<void> {
    if (this.client?.connected) {
      return;
    }

    if (!this.configPromise) {
      this.configPromise = this.initializeClient();
    }

    return this.configPromise;
  }

  private async initializeClient(): Promise<void> {
    const config = await getBackendConfig();
    this.destination = {
      chatSendDestination: config.chatSendDestination,
      chatMessageSubscription: config.chatMessageSubscription,
      chatErrorSubscription: config.chatErrorSubscription
    };

    return new Promise<void>((resolve, reject) => {
      const client = new Client({
        brokerURL: resolveWebSocketUrl(config.webSocketEndpoint),
        reconnectDelay: 5000,
        debug: () => undefined
      });

      client.onConnect = () => {
        client.subscribe(this.destination.chatMessageSubscription, (message) => {
          this.handleMessage(message);
        });
        client.subscribe(this.destination.chatErrorSubscription, (message) => {
          this.handleError(message);
        });
        this.client = client;
        resolve();
      };

      client.onStompError = (frame) => {
        const message = frame.headers.message ?? 'Chat connection failed.';
        this.configPromise = null;
        this.rejectAllPending(message);
        reject(new Error(message));
      };

      client.onWebSocketError = () => {
        this.configPromise = null;
        this.rejectAllPending('Chat connection failed.');
        reject(new Error('Chat connection failed.'));
      };

      client.onWebSocketClose = () => {
        this.client = null;
        this.configPromise = null;
        this.rejectAllPending('Chat connection closed.');
      };

      client.activate();
    });
  }

  private handleMessage(message: IMessage) {
    let payload: ChatMessageEvent;
    try {
      payload = parseChatMessageEvent(message.body);
    } catch {
      this.rejectOldestPending('Received invalid chat message payload.');
      return;
    }

    const pendingRequest = this.pendingRequests.get(payload.clientMessageId);
    if (!pendingRequest) {
      return;
    }

    window.clearTimeout(pendingRequest.timeoutId);
    this.pendingRequests.delete(payload.clientMessageId);
    const { resolve } = pendingRequest;
    resolve(payload);
  }

  private handleError(message: IMessage) {
    let payload: ChatErrorEvent;
    try {
      payload = parseChatErrorEvent(message.body);
    } catch {
      this.rejectAllPending('Received invalid chat error payload.');
      return;
    }

    const errorMessage = payload.message || 'Unable to process chat request.';
    this.rejectPendingById(payload.clientMessageId, errorMessage);
  }

  private rejectPendingById(clientMessageId: string, message: string) {
    const pendingRequest = this.pendingRequests.get(clientMessageId);
    if (!pendingRequest) {
      return;
    }

    window.clearTimeout(pendingRequest.timeoutId);
    this.pendingRequests.delete(clientMessageId);
    const { reject } = pendingRequest;
    reject(new Error(message));
  }

  private rejectOldestPending(message: string) {
    const oldestClientMessageId = this.pendingRequests.keys().next().value as string | undefined;
    if (!oldestClientMessageId) {
      return;
    }
    this.rejectPendingById(oldestClientMessageId, message);
  }

  private rejectAllPending(message: string) {
    const clientMessageIds = [...this.pendingRequests.keys()];
    clientMessageIds.forEach((clientMessageId) => this.rejectPendingById(clientMessageId, message));
  }
}

const chatSocketService = new ChatSocketService();

export function sendChatMessage(request: ChatSendRequest) {
  return chatSocketService.sendMessage(request);
}
