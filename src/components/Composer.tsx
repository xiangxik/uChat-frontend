import type { FormEvent } from 'react';
import { SendIcon } from './icons';

interface ComposerProps {
  input: string;
  isThinking: boolean;
  messagePlaceholder: string;
  sendLabel: string;
  tipText: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function Composer({ input, isThinking, messagePlaceholder, sendLabel, tipText, onInputChange, onSubmit }: ComposerProps) {
  const isSubmitDisabled = !input.trim();

  return (
    <form onSubmit={onSubmit} className="border-t border-[#dbe1e9] bg-[#f4f7fb] px-3 py-2.5 md:px-4 md:py-3">
      <div className="relative">
        <div className="w-full rounded-[8px] border border-[#c4cfdd] bg-white px-3 pr-[80px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition focus-within:border-[#3c5f87] focus-within:ring-2 focus-within:ring-[#c8d9ec]">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
              placeholder={messagePlaceholder}
            rows={3}
            className="w-full resize-none bg-transparent px-0 py-2.5 text-[13px] leading-6 text-[#23364d] outline-none transition placeholder:text-[#6f87a6] md:min-h-[70px]"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-label={sendLabel}
          title={isThinking ? `${sendLabel} (processing...)` : sendLabel}
          className="absolute right-2 top-1/2 z-10 flex h-[54px] w-[54px] -translate-y-1/2 items-center justify-center rounded-[10px] border border-[#1d3e62] bg-[#234b75] text-white shadow-[0_8px_16px_rgba(29,62,98,0.28)] transition duration-150 hover:scale-[1.03] hover:bg-[#1f4268] hover:shadow-[0_12px_20px_rgba(29,62,98,0.32)] active:scale-100 active:shadow-[0_6px_12px_rgba(29,62,98,0.26)] disabled:cursor-not-allowed disabled:bg-[#8fa2b7] disabled:shadow-none"
        >
          <SendIcon />
        </button>
      </div>
      <p className="mt-1.5 text-[11px] tracking-[0.03em] text-[#6e819a]">{tipText}</p>
    </form>
  );
}
