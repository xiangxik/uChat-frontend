import { resolveHttpUrl } from './backendConfig';

export async function submitBotFeedback(messageId: string, rating: number): Promise<void> {
  const response = await fetch(resolveHttpUrl('/api/feedback'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageId, rating })
  });

  if (!response.ok) {
    throw new Error(`Feedback request failed with status ${response.status}`);
  }
}
