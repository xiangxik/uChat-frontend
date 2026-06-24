import { useState } from 'react';
import { copy, type Locale } from '../content/copy';
import type { ChatMessage } from '../types/chat';
import type { FeedbackPhase } from '../types/chat';
import { formatMessageTime } from '../utils/chat';
import { BotIcon, StarIcon, UserIcon } from './icons';

const messagePanelClasses =
  'max-w-[90%] rounded-[10px] border px-3 py-2 text-[13px] leading-5 shadow-[0_5px_16px_rgba(22,37,62,0.08)] md:max-w-[82%]';

const userMessageClasses = 'border-[#d5dce6] bg-[#eef3f9] text-[#243449]';
const botMessageClasses = 'border-[#e0e5ec] bg-[#ffffff] text-[#2a3b51]';

interface MessageRowProps {
  message: ChatMessage;
  rating: number;
  locale: Locale;
  feedbackPhase: FeedbackPhase;
  thankYouText: string;
  ratingLabels: string[];
  onRate: (messageId: string, rating: number) => void;
}

export function ChatMessageRow({ message, rating, locale, feedbackPhase, thankYouText, ratingLabels, onRate }: MessageRowProps) {
  const isUser = message.sender === 'user';
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const visibleRating = hoverRating ?? rating;

  return (
    <div className={`flex items-start ${isUser ? 'justify-end gap-2' : 'justify-start gap-2'}`}>
      {!isUser && (
        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#dde4ed] bg-[#ffffff] text-[#4f6380] shadow-[0_3px_8px_rgba(22,37,62,0.08)]">
          <BotIcon />
        </span>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <article className={`relative ${messagePanelClasses} ${isUser ? userMessageClasses : botMessageClasses}`}>
          {isUser ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[-8px] top-[10px] h-0 w-0 border-y-[7px] border-y-transparent border-l-[8px] border-l-[#d5dce6]"
            >
              <span className="absolute right-[1px] top-[-7px] h-0 w-0 border-y-[7px] border-y-transparent border-l-[8px] border-l-[#eef3f9]" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[-8px] top-[10px] h-0 w-0 border-y-[7px] border-y-transparent border-r-[8px] border-r-[#e0e5ec]"
            >
              <span className="absolute left-[1px] top-[-7px] h-0 w-0 border-y-[7px] border-y-transparent border-r-[8px] border-r-[#ffffff]" />
            </span>
          )}
          <p className="m-0">{message.content}</p>
        </article>

        {!isUser ? (
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] tracking-[0.04em]">
            <time className="text-[#8c9eb6]">{formatMessageTime(message.timestamp, locale)}</time>
            <div className="relative ml-1 h-4 min-w-[170px] md:min-w-[220px]">
              {feedbackPhase === 'thank-you' ? (
                <span className="absolute inset-0 flex items-center whitespace-nowrap animate-feedback-fade-out font-medium tracking-[0.06em] text-[#7f8fa4]">
                  {thankYouText}
                </span>
              ) : (
                <div className="absolute inset-0 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= visibleRating;
                    const label = ratingLabels[star - 1] || copy[locale].ratingLabels[star as 1 | 2 | 3 | 4 | 5];
                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={`${star} 星`}
                        title={label}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onFocus={() => setHoverRating(star)}
                        onBlur={() => setHoverRating(null)}
                        onClick={() => onRate(message.id, star)}
                        className={`group/star relative rounded-full p-0.5 leading-none transition ${filled ? 'text-[#c59b4a]' : 'text-[#b6c1cf] hover:text-[#8aa0bb]'}`}
                      >
                        <span className="pointer-events-none absolute left-1/2 bottom-[-22px] z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#d8e1eb] bg-white px-2 py-0.5 text-[10px] font-medium tracking-[0.03em] text-[#41556f] opacity-0 shadow-[0_4px_12px_rgba(22,37,62,0.08)] transition duration-150 group-hover/star:opacity-100 group-focus-visible/star:opacity-100">
                          {label}
                        </span>
                        <StarIcon filled={filled} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <time className="mt-0.5 block text-right text-[10px] tracking-[0.04em] text-[#7f92aa]">{formatMessageTime(message.timestamp, locale)}</time>
        )}
      </div>

      {isUser && (
        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#d6b97f] bg-[linear-gradient(145deg,#d8c092,#bd9b60)] text-[#2b3c52] shadow-[0_3px_8px_rgba(44,58,81,0.12)]">
          <UserIcon />
        </span>
      )}
    </div>
  );
}
