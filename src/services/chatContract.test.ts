import { describe, expect, it } from 'vitest';
import { parseChatErrorEvent, parseChatMessageEvent } from './chatContract';

describe('chat contract parser', () => {
  it('accepts a backend-aligned chat message payload', () => {
    const payload = JSON.stringify({
      id: 'bot-1',
      clientMessageId: 'client-1',
      conversationId: 'conv-1',
      sender: 'bot',
      content: 'hello',
      timestamp: '2026-06-21T08:00:00Z'
    });

    expect(parseChatMessageEvent(payload)).toEqual({
      id: 'bot-1',
      clientMessageId: 'client-1',
      conversationId: 'conv-1',
      sender: 'bot',
      content: 'hello',
      timestamp: '2026-06-21T08:00:00Z'
    });
  });

  it('rejects a chat message payload when fields do not match contract exactly', () => {
    const payload = JSON.stringify({
      id: 'bot-1',
      clientMessageId: 'client-1',
      conversationId: 'conv-1',
      sender: 'bot',
      content: 'hello',
      timestamp: '2026-06-21T08:00:00Z',
      extraField: 'not-allowed'
    });

    expect(() => parseChatMessageEvent(payload)).toThrow();
  });

  it('accepts a backend-aligned chat error payload', () => {
    const payload = JSON.stringify({
      code: 'CHAT_BAD_REQUEST',
      message: 'locale must be zh or en',
      clientMessageId: 'client-1',
      timestamp: '2026-06-21T08:00:00Z'
    });

    expect(parseChatErrorEvent(payload)).toEqual({
      code: 'CHAT_BAD_REQUEST',
      message: 'locale must be zh or en',
      clientMessageId: 'client-1',
      timestamp: '2026-06-21T08:00:00Z'
    });
  });

  it('rejects a chat error payload when clientMessageId is null', () => {
    const payload = JSON.stringify({
      code: 'CHAT_INTERNAL_ERROR',
      message: 'Unable to process chat request.',
      clientMessageId: null,
      timestamp: '2026-06-21T08:00:00Z'
    });

    expect(() => parseChatErrorEvent(payload)).toThrow();
  });

  it('rejects a chat error payload missing required fields', () => {
    const payload = JSON.stringify({
      code: 'CHAT_BAD_REQUEST',
      clientMessageId: 'client-1',
      timestamp: '2026-06-21T08:00:00Z'
    });

    expect(() => parseChatErrorEvent(payload)).toThrow();
  });
});
