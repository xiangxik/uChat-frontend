export interface ChatMessageEvent {
  id: string;
  clientMessageId: string;
  conversationId: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface ChatErrorEvent {
  code: string;
  message: string;
  clientMessageId: string;
  timestamp: string;
}

const chatMessageKeys = [
  'id',
  'clientMessageId',
  'conversationId',
  'sender',
  'content',
  'timestamp'
] as const;

const chatErrorKeys = ['code', 'message', 'clientMessageId', 'timestamp'] as const;

function parseJsonObject(payload: string): Record<string, unknown> {
  const value: unknown = JSON.parse(payload);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Payload must be a JSON object.');
  }
  return value as Record<string, unknown>;
}

function assertExactKeys(payload: Record<string, unknown>, expectedKeys: readonly string[]): void {
  const actualKeys = Object.keys(payload).sort();
  const normalizedExpected = [...expectedKeys].sort();
  if (actualKeys.length !== normalizedExpected.length) {
    throw new Error('Payload has unexpected number of fields.');
  }

  for (let i = 0; i < actualKeys.length; i += 1) {
    if (actualKeys[i] !== normalizedExpected[i]) {
      throw new Error('Payload fields do not match contract.');
    }
  }
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Field ${fieldName} must be a non-empty string.`);
  }
}

export function parseChatMessageEvent(rawBody: string): ChatMessageEvent {
  const payload = parseJsonObject(rawBody);
  assertExactKeys(payload, chatMessageKeys);

  assertNonEmptyString(payload.id, 'id');
  assertNonEmptyString(payload.clientMessageId, 'clientMessageId');
  assertNonEmptyString(payload.conversationId, 'conversationId');
  assertNonEmptyString(payload.content, 'content');
  assertNonEmptyString(payload.timestamp, 'timestamp');

  if (payload.sender !== 'user' && payload.sender !== 'bot') {
    throw new Error('Field sender must be either user or bot.');
  }

  return {
    id: payload.id,
    clientMessageId: payload.clientMessageId,
    conversationId: payload.conversationId,
    sender: payload.sender,
    content: payload.content,
    timestamp: payload.timestamp
  };
}

export function parseChatErrorEvent(rawBody: string): ChatErrorEvent {
  const payload = parseJsonObject(rawBody);
  assertExactKeys(payload, chatErrorKeys);

  assertNonEmptyString(payload.code, 'code');
  assertNonEmptyString(payload.message, 'message');
  assertNonEmptyString(payload.clientMessageId, 'clientMessageId');
  assertNonEmptyString(payload.timestamp, 'timestamp');

  return {
    code: payload.code,
    message: payload.message,
    clientMessageId: payload.clientMessageId,
    timestamp: payload.timestamp
  };
}
