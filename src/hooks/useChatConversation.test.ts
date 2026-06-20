import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useChatConversation } from './useChatConversation';
import { generateBotReply } from '../services/mockBot';

vi.mock('../services/mockBot', () => ({
  generateBotReply: vi.fn(async () => 'mock bot reply')
}));

describe('useChatConversation', () => {
  it('starts with one initial bot message', () => {
    const { result } = renderHook(() => useChatConversation('Welcome'));
    expect(result.current.messages).toHaveLength(1);
  });

  it('submits user input and appends bot response', async () => {
    const { result } = renderHook(() => useChatConversation('Welcome'));

    act(() => {
      result.current.setInput('hello');
    });

    await act(async () => {
      await result.current.submitMessage('en');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(generateBotReply).toHaveBeenCalledWith('hello', 'en');
  });
});
