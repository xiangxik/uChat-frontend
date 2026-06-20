import type { Locale } from '../content/copy';
import { copy } from '../content/copy';
import type { ChatMessage } from '../types/chat';

export function formatMessageTime(timestamp: string, locale: Locale) {
  return new Date(timestamp).toLocaleTimeString(copy[locale].timeLocale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function createMessage(sender: ChatMessage['sender'], content: string): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    content,
    timestamp: new Date().toISOString()
  };
}
