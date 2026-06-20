export function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 16 0" strokeLinecap="round" />
      <path d="M6 12v5a2 2 0 0 0 2 2h1" strokeLinecap="round" />
      <path d="M18 12v5a2 2 0 0 1-2 2h-1" strokeLinecap="round" />
      <path d="M9 16h6" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M4 12L20 4L13 20L10.5 13.5L4 12Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#30a46c]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" opacity="0.35" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3.6 14.9 9l6 .9-4.3 4.2 1 6-5.6-3-5.6 3 1-6L3.1 9.9l6-.9L12 3.6Z" strokeLinejoin="round" />
    </svg>
  );
}
