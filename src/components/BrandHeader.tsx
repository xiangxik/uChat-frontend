import { copy, type Locale } from '../content/copy';
import { StatusIcon } from './icons';

interface BrandHeaderProps {
  appName: string;
  locale: Locale;
  serviceCenterText: string;
  onlineText: string;
  onLocaleChange: (locale: Locale) => void;
}

export function BrandHeader({ appName, locale, serviceCenterText, onlineText, onLocaleChange }: BrandHeaderProps) {
  return (
    <div className="relative flex items-center justify-between border-b border-[#dbe1e9] bg-[#ffffff] px-5 py-4 md:px-7 md:py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#d5b878] bg-[linear-gradient(145deg,#d7bd89,#b69453)] text-sm font-semibold tracking-[0.08em] text-[#1a2637]">
          UC
        </span>
        <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#7f6b46]">{appName} {serviceCenterText}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-full border border-[#cfe1d2] bg-[#eef8f0] px-2.5 py-1.5" aria-label={onlineText} title={onlineText}>
          <StatusIcon />
        </div>
        <div className="flex items-center rounded-full border border-[#dbe1e9] bg-white p-0.5 shadow-[0_2px_8px_rgba(28,42,64,0.06)]">
          <button
            type="button"
            onClick={() => onLocaleChange('zh')}
            className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.12em] transition ${locale === 'zh' ? 'bg-[#234b75] text-white' : 'text-[#5a6b81] hover:bg-[#eef3f9]'}`}
            aria-pressed={locale === 'zh'}
          >
            {copy[locale].language.chinese}
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange('en')}
            className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.12em] transition ${locale === 'en' ? 'bg-[#234b75] text-white' : 'text-[#5a6b81] hover:bg-[#eef3f9]'}`}
            aria-pressed={locale === 'en'}
          >
            {copy[locale].language.english}
          </button>
        </div>
      </div>
    </div>
  );
}
