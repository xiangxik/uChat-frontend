import { useEffect, useRef, useState } from 'react';
import { submitBotFeedback } from '../services/feedbackApi';
import { toAppError } from '../services/apiError';
import type { FeedbackPhase } from '../types/chat';

export function useMessageFeedback() {
  const [messageRatings, setMessageRatings] = useState<Record<string, number>>({});
  const [feedbackPhases, setFeedbackPhases] = useState<Record<string, FeedbackPhase>>({});
  const feedbackTimersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const timers = feedbackTimersRef.current;
    return () => {
      Object.values(timers).forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  function registerBotMessage(messageId: string) {
    setMessageRatings((prev) => ({
      ...prev,
      [messageId]: 0
    }));
    setFeedbackPhases((prev) => ({
      ...prev,
      [messageId]: 'stars'
    }));
  }

  function handleRate(messageId: string, nextRating: number) {
    setMessageRatings((prev) => ({
      ...prev,
      [messageId]: nextRating
    }));
    setFeedbackPhases((prev) => ({
      ...prev,
      [messageId]: 'thank-you'
    }));

    const existingTimer = feedbackTimersRef.current[messageId];
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    feedbackTimersRef.current[messageId] = window.setTimeout(() => {
      setFeedbackPhases((prev) => ({
        ...prev,
        [messageId]: 'stars'
      }));
      delete feedbackTimersRef.current[messageId];
    }, 900);

    void submitBotFeedback(messageId, nextRating).catch((error: unknown) => {
      const appError = toAppError(error, 'Failed to submit feedback.');
      console.warn('Feedback submission failed:', appError.message);
    });
  }

  function getMessageRating(messageId: string) {
    return messageRatings[messageId] ?? 0;
  }

  function getFeedbackPhase(messageId: string): FeedbackPhase {
    return feedbackPhases[messageId] ?? 'stars';
  }

  return {
    handleRate,
    registerBotMessage,
    getMessageRating,
    getFeedbackPhase
  };
}
