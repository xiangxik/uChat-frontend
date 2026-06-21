import { useEffect, useState, type FormEvent } from 'react';
import { copy, type Locale } from './content/copy';
import { BrandHeader } from './components/BrandHeader';
import { ChatMessageRow } from './components/ChatMessageRow';
import { Composer } from './components/Composer';
import { useMessageFeedback } from './hooks/useMessageFeedback';
import { useChatConversation } from './hooks/useChatConversation';
import { getBackendConfig, type BackendConfig } from './services/backendConfig';

const containerClasses =
  'relative flex h-[92vh] min-h-[620px] w-full max-w-[1320px] flex-col overflow-hidden rounded-[14px] border border-[#d7dce3] bg-[#f8f9fb] shadow-[0_18px_48px_rgba(28,42,64,0.14)]';

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [appName, setAppName] = useState('uChat');
  const [backendConfig, setBackendConfig] = useState<BackendConfig | null>(null);
  const { input, setInput, isThinking, messages, submitMessage, updateInitialBotMessage } = useChatConversation(copy.en.initialBotMessage);
  const { handleRate, registerBotMessage, getMessageRating, getFeedbackPhase } = useMessageFeedback();

  const localizedFallback = copy[locale];
  const localizedConfig = {
    messagePlaceholder: backendConfig?.messagePlaceholder || localizedFallback.messagePlaceholder,
    sendLabel: backendConfig?.sendLabel || localizedFallback.send,
    tipText: backendConfig?.tipText || localizedFallback.tip,
    thankYouText: backendConfig?.thankYouText || localizedFallback.thankYou,
    thinkingText: backendConfig?.thinkingText || localizedFallback.thinking,
    serviceCenterText: backendConfig?.serviceCenterText || localizedFallback.serviceCenter,
    onlineText: backendConfig?.onlineText || localizedFallback.online,
    ratingLabels: backendConfig?.ratingLabels || Object.values(localizedFallback.ratingLabels)
  };

  useEffect(() => {
    let cancelled = false;

    void getBackendConfig().then((config) => {
      if (cancelled) {
        return;
      }
      setBackendConfig(config);
      const nextLocale: Locale = config.locale === 'zh' ? 'zh' : 'en';
      setLocale(nextLocale);
      setAppName(config.appName || 'uChat');
      updateInitialBotMessage(config.initialBotMessage || copy[nextLocale].initialBotMessage);
    });

    return () => {
      cancelled = true;
    };
  }, [updateInitialBotMessage]);

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);
    void getBackendConfig(nextLocale).then((config) => {
      setBackendConfig(config);
      setAppName(config.appName || 'uChat');
      updateInitialBotMessage(config.initialBotMessage || copy[nextLocale].initialBotMessage);
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await submitMessage(locale);
    if (result.botMessageId) {
      registerBotMessage(result.botMessageId);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 py-4 md:px-8 md:py-8">
      <section className={containerClasses}>
        <BrandHeader
          appName={appName}
          locale={locale}
          serviceCenterText={localizedConfig.serviceCenterText}
          onlineText={localizedConfig.onlineText}
          onLocaleChange={handleLocaleChange}
        />

        <div className="flex-1 overflow-hidden bg-[linear-gradient(180deg,#f9fbfd,#f1f5f9)]">
          <div className="flex h-full flex-col">
            <div className="scrollbar-fancy flex-1 space-y-2 overflow-y-auto px-4 py-4 md:px-7 md:py-6">
              {messages.map((message) => (
                <ChatMessageRow
                  key={message.id}
                  message={message}
                  rating={getMessageRating(message.id)}
                  locale={locale}
                  feedbackPhase={getFeedbackPhase(message.id)}
                  thankYouText={localizedConfig.thankYouText}
                  ratingLabels={localizedConfig.ratingLabels}
                  onRate={handleRate}
                />
              ))}

              {isThinking && (
                <div className="inline-flex items-center gap-2 rounded-[10px] border border-[#d8e1eb] bg-[#ffffff] px-4 py-3 text-[13px] text-[#39506d] shadow-[0_4px_14px_rgba(22,37,62,0.08)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#315f8b]" />
                  {localizedConfig.thinkingText}
                </div>
              )}
            </div>

            <Composer
              input={input}
              isThinking={isThinking}
              messagePlaceholder={localizedConfig.messagePlaceholder}
              sendLabel={localizedConfig.sendLabel}
              tipText={localizedConfig.tipText}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
