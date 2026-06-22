import { requestVoid } from './httpClient';

export async function submitBotFeedback(messageId: string, rating: number): Promise<void> {
  await requestVoid({
    path: '/api/feedback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageId, rating })
  });
}
