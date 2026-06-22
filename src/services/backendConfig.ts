import { requestJson } from './httpClient';

export interface BackendConfig {
  appName: string;
  defaultLocale: 'en' | 'zh';
  locale: 'en' | 'zh';
  initialBotMessage: string;
  messagePlaceholder: string;
  sendLabel: string;
  tipText: string;
  thankYouText: string;
  thinkingText: string;
  serviceCenterText: string;
  onlineText: string;
  ratingLabels: string[];
  webSocketEndpoint: string;
  chatSendDestination: string;
  chatMessageSubscription: string;
  chatErrorSubscription: string;
}

const backendConfigPromiseByLocale = new Map<'default' | 'en' | 'zh', Promise<BackendConfig>>();

function defaultConfig(locale: 'en' | 'zh'): BackendConfig {
  return locale === 'zh'
    ? {
        appName: 'uChat',
        defaultLocale: 'en',
        locale: 'zh',
        initialBotMessage: '欢迎来到 uChat 企业服务中心。请告诉我们你想咨询的业务，我们将为你安排专员跟进。',
        messagePlaceholder: '例如：我想了解企业贷款方案与办理条件',
        sendLabel: '发送消息',
        tipText: '提示: 本页面回复为演示资讯，正式业务请以人工服务及官方文件为准。',
        thankYouText: '感谢你的反馈',
        thinkingText: '顾问正在为您查询资料...',
        serviceCenterText: '服务中心',
        onlineText: '在线',
        ratingLabels: ['不满意', '一般', '满意', '很满意', '非常满意'],
        webSocketEndpoint: '/ws',
        chatSendDestination: '/app/chat.send',
        chatMessageSubscription: '/user/queue/chat.messages',
        chatErrorSubscription: '/user/queue/chat.errors'
      }
    : {
        appName: 'uChat',
        defaultLocale: 'en',
        locale: 'en',
        initialBotMessage: 'Welcome to the uChat Enterprise Service Center. Tell us what you would like to ask and we will arrange a specialist to follow up.',
        messagePlaceholder: 'For example: I want to learn about business loan options and eligibility',
        sendLabel: 'Send message',
        tipText: 'Note: Responses on this page are for demo purposes only. Please refer to official documents and human support for formal business matters.',
        thankYouText: 'Thank you for your feedback',
        thinkingText: 'Advisor is checking the details...',
        serviceCenterText: 'Service Center',
        onlineText: 'Online',
        ratingLabels: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
        webSocketEndpoint: '/ws',
        chatSendDestination: '/app/chat.send',
        chatMessageSubscription: '/user/queue/chat.messages',
        chatErrorSubscription: '/user/queue/chat.errors'
      };
}

function resolveRequestedLocale(locale?: 'en' | 'zh'): 'en' | 'zh' {
  return locale === 'zh' ? 'zh' : 'en';
}

export async function getBackendConfig(locale?: 'en' | 'zh'): Promise<BackendConfig> {
  const cacheKey: 'default' | 'en' | 'zh' = locale ?? 'default';
  const requestedLocale = resolveRequestedLocale(locale);

  if (!backendConfigPromiseByLocale.has(cacheKey)) {
    const query = locale ? `?locale=${requestedLocale}` : '';
    backendConfigPromiseByLocale.set(
      cacheKey,
      requestJson<BackendConfig>({
        path: `/api/config${query}`
      })
        .catch((error: unknown) => {
          console.warn('Falling back to default backend config.', error);
          return defaultConfig(requestedLocale);
        })
    );
  }

  return backendConfigPromiseByLocale.get(cacheKey)!;
}
