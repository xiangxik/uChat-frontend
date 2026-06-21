import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMessageFeedback } from './useMessageFeedback';
import { submitBotFeedback } from '../services/feedbackApi';

vi.mock('../services/feedbackApi', () => ({
  submitBotFeedback: vi.fn(async () => undefined)
}));

describe('useMessageFeedback', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('registers default rating state for a new bot message', () => {
    const { result } = renderHook(() => useMessageFeedback());

    act(() => {
      result.current.registerBotMessage('m-1');
    });

    expect(result.current.getMessageRating('m-1')).toBe(0);
    expect(result.current.getFeedbackPhase('m-1')).toBe('stars');
  });

  it('transitions from thank-you to final after timer', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMessageFeedback());

    act(() => {
      result.current.registerBotMessage('m-2');
      result.current.handleRate('m-2', 4);
    });

    expect(result.current.getMessageRating('m-2')).toBe(4);
    expect(result.current.getFeedbackPhase('m-2')).toBe('thank-you');
    expect(submitBotFeedback).toHaveBeenCalledWith('m-2', 4);

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(result.current.getFeedbackPhase('m-2')).toBe('stars');
  });
});
