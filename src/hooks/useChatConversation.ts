import { useState } from 'react';
import type { Locale } from '../content/copy';
import { generateBotReply } from '../services/mockBot';
import type { ChatMessage } from '../types/chat';
import { createMessage } from '../utils/chat';

interface SubmitResult {
  botMessageId: string | null;
}

export function useChatConversation(initialBotMessage: string) {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([createMessage('bot', initialBotMessage)]);

  async function submitMessage(locale: Locale): Promise<SubmitResult> {
    const text = input.trim();
    if (!text || isThinking) {
      return { botMessageId: null };
    }

    setInput('');
    const userMessage = createMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const reply = await generateBotReply(text, locale);
      const botMessage = createMessage('bot', reply);
      setMessages((prev) => [...prev, botMessage]);
      return { botMessageId: botMessage.id };
    } finally {
      setIsThinking(false);
    }
  }

  return {
    input,
    setInput,
    isThinking,
    messages,
    submitMessage
  };
}
