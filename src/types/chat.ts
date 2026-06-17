export type Sender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: Sender;
  content: string;
  timestamp: string;
}
