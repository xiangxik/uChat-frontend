import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useChatConversation } from './useChatConversation';
import { sendChatMessage } from '../services/chatSocket';

vi.mock('../services/chatSocket', () => ({
  sendChatMessage: vi.fn()
}));

const sendChatMessageMock = vi.mocked(sendChatMessage);

describe('useChatConversation', () => {
  it('starts with one initial bot message', () => {
    const { result } = renderHook(() => useChatConversation('Welcome'));
    expect(result.current.messages).toHaveLength(1);
  });

  it('submits user input and appends bot response', async () => {
    sendChatMessageMock.mockResolvedValueOnce({
      id: 'bot-1',
      clientMessageId: 'client-1',
      conversationId: 'conv-1',
      sender: 'bot',
      content: 'mock bot reply',
      timestamp: '2026-06-21T00:00:00.000Z'
    });

    const { result } = renderHook(() => useChatConversation('Welcome'));

    act(() => {
      result.current.setInput('hello');
    });

    await act(async () => {
      await result.current.submitMessage('en');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(sendChatMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'hello',
        locale: 'en',
        clientMessageId: expect.any(String),
        conversationId: expect.any(String)
      })
    );
  });

  it('appends fallback bot message when send fails', async () => {
    sendChatMessageMock.mockRejectedValueOnce(new Error('Contract rejected by server'));

    const { result } = renderHook(() => useChatConversation('Welcome'));

    act(() => {
      result.current.setInput('hello');
    });

    await act(async () => {
      await result.current.submitMessage('en');
    });

    expect(result.current.messages).toHaveLength(3);
    const lastMessage = result.current.messages[2];
    expect(lastMessage).toBeDefined();
    expect(lastMessage?.sender).toBe('bot');
    expect(lastMessage?.content).toContain('Contract rejected by server');
  });
});
