export type Sender = 'user' | 'bot';
export type FeedbackPhase = 'stars' | 'thank-you';

export interface ChatMessage {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
}
