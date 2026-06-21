import { useCallback, useRef, useState } from 'react';
import type { Locale } from '../content/copy';
import { sendChatMessage } from '../services/chatSocket';
import type { ChatMessage } from '../types/chat';
import { createMessage } from '../utils/chat';

interface SubmitResult {
  botMessageId: string | null;
}

function createConversationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `conv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useChatConversation(initialBotMessage: string) {
  const [input, setInput] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([createMessage('bot', initialBotMessage)]);
  const conversationIdRef = useRef(createConversationId());
  const isThinking = pendingCount > 0;

  const updateInitialBotMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].sender !== 'bot') {
        return prev;
      }
      return [{ ...prev[0], content }];
    });
  }, []);

  async function submitMessage(locale: Locale): Promise<SubmitResult> {
    const text = input.trim();
    if (!text) {
      return { botMessageId: null };
    }

    setInput('');
    const userMessage = createMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    setPendingCount((count) => count + 1);

    try {
      const botReply = await sendChatMessage({
        conversationId: conversationIdRef.current,
        clientMessageId: userMessage.id,
        content: text,
        locale
      });
      const botMessage: ChatMessage = {
        id: botReply.id,
        sender: botReply.sender,
        content: botReply.content,
        timestamp: botReply.timestamp
      };
      setMessages((prev) => [...prev, botMessage]);
      return { botMessageId: botMessage.id };
    } catch (error) {
      const fallbackMessage = createMessage(
        'bot',
        error instanceof Error
          ? error.message
          : locale === 'en'
            ? 'Unable to reach the service right now. Please try again shortly.'
            : '暂时未能连接服务，请稍后再试。'
      );
      setMessages((prev) => [...prev, fallbackMessage]);
      return { botMessageId: null };
    } finally {
      setPendingCount((count) => Math.max(0, count - 1));
    }
  }

  return {
    input,
    setInput,
    isThinking,
    messages,
    submitMessage,
    updateInitialBotMessage
  };
}
