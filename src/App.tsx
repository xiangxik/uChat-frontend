import { FormEvent, useState } from 'react';
import { generateBotReply } from './services/mockBot';
import type { ChatMessage } from './types/chat';

const INITIAL_BOT_MESSAGE = '欢迎使用 uChat 企业助理。请告诉我你想了解的服务或问题。';
const MESSAGE_PLACEHOLDER = '例如：我想了解企业贷款方案';

const containerClasses =
  'animate-rise flex h-[88vh] min-h-[620px] w-full max-w-[1280px] flex-col overflow-hidden rounded-[10px] border border-[var(--line-main)] bg-[#fefdfa] shadow-sm';

const messagePanelClasses =
  'max-w-[82%] rounded-[8px] border px-4 py-3 text-[13px] leading-6 shadow-sm';

const userMessageClasses = 'border-[#c3ccd5] bg-[#eef2f5] text-[#1f3a52]';
const botMessageClasses = 'border-[var(--line-sub)] bg-[#fcfbf8] text-slate-700';

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3v3" strokeLinecap="round" />
      <rect x="5" y="8" width="14" height="10" rx="4" />
      <path d="M9 13h.01M15 13h.01" strokeLinecap="round" />
      <path d="M9 16h6" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  );
}

function getNowTime() {
  return new Date().toLocaleTimeString('zh-HK', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function createMessage(sender: ChatMessage['sender'], content: string): ChatMessage {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    content,
    timestamp: getNowTime()
  };
}

function BrandHeader() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--line-sub)] bg-[#fcfbf8] px-5 py-3.5 md:px-7 md:py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center bg-brand-deep text-sm font-semibold tracking-[0.06em] text-white">
          UC
        </span>
        <h2 className="m-0 text-[17px] font-semibold tracking-[0.01em] text-brand-deep">uChat Enterprise</h2>
      </div>
      <span className="rounded-[6px] border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-emerald-700">
        Online
      </span>
    </div>
  );
}

interface MessageRowProps {
  message: ChatMessage;
}

function MessageRow({ message }: MessageRowProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[var(--line-sub)] bg-[#fcfbf8] text-slate-600 shadow-sm">
          <BotIcon />
        </span>
      )}

      <article className={`${messagePanelClasses} ${isUser ? userMessageClasses : botMessageClasses}`}>
        <p className={`m-0 mb-1 text-[11px] font-semibold tracking-[0.05em] ${isUser ? 'text-[#30506a]' : 'text-slate-500'}`}>
          {isUser ? '客户' : '服务助理'}
        </p>
        <p className="m-0">{message.content}</p>
        <time className={`mt-1.5 block text-right text-[11px] ${isUser ? 'text-[#4f687e]' : 'text-slate-400'}`}>
          {message.timestamp}
        </time>
      </article>

      {isUser && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-brand-deep text-white shadow-sm">
          <UserIcon />
        </span>
      )}
    </div>
  );
}

interface ComposerProps {
  input: string;
  isThinking: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function Composer({ input, isThinking, onInputChange, onSubmit }: ComposerProps) {
  return (
    <form onSubmit={onSubmit} className="border-t border-[var(--line-sub)] bg-[#fcfbf8] px-5 py-4 md:px-7 md:py-4">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-stretch">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={MESSAGE_PLACEHOLDER}
          rows={2}
          className="w-full flex-1 resize-none bg-transparent px-0 py-2.5 text-[13px] leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 md:min-h-[46px]"
        />
        <button
          type="submit"
          disabled={isThinking}
          className="w-full rounded-[4px] bg-brand-deep px-6 py-2.5 text-[13px] font-semibold tracking-[0.04em] text-white transition hover:bg-[#234a69] disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto md:min-w-[118px] md:self-stretch"
        >
          发送
        </button>
      </div>
      <p className="mt-2 text-[11px] tracking-[0.02em] text-slate-500">提示: 本页面回复为演示资讯，正式业务请以人工服务及官方文件为准。</p>
    </form>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([createMessage('bot', INITIAL_BOT_MESSAGE)]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isThinking) {
      return;
    }

    setInput('');
    const userMessage = createMessage('user', text);
    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      const reply = await generateBotReply(text);
      setMessages((prev) => [...prev, createMessage('bot', reply)]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-5 md:px-8 md:py-8">
      <section className={containerClasses}>
        <BrandHeader />

        <div className="flex-1 overflow-hidden bg-gradient-to-b from-[#f4f3ef] to-[#efeee9]">
          <div className="flex h-full flex-col bg-white">
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 md:px-7 md:py-5">
              {messages.map((message) => (
                <MessageRow key={message.id} message={message} />
              ))}

              {isThinking && (
                <div className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--line-sub)] bg-[#fcfbf8] px-4 py-3 text-[13px] text-slate-600 shadow-sm">
                  <span className="h-2 w-2 animate-pulse bg-brand-deep" />
                  正在整理回复...
                </div>
              )}
            </div>

            <Composer input={input} isThinking={isThinking} onInputChange={setInput} onSubmit={handleSubmit} />
          </div>
        </div>
      </section>
    </div>
  );
}
