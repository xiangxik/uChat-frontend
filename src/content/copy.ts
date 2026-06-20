export type Locale = 'zh' | 'en';

export const copy = {
  zh: {
    initialBotMessage: '欢迎来到 uChat 企业服务中心。请告诉我们你想咨询的业务，我们将为你安排专员跟进。',
    messagePlaceholder: '例如：我想了解企业贷款方案与办理条件',
    serviceCenter: '服务中心',
    online: '在线',
    send: '发送消息',
    tip: '提示: 本页面回复为演示资讯，正式业务请以人工服务及官方文件为准。',
    thankYou: '感谢你的反馈',
    thinking: '顾问正在为您查询资料...',
    timeLocale: 'zh-HK',
    ratingLabels: {
      1: '不满意',
      2: '一般',
      3: '满意',
      4: '很满意',
      5: '非常满意'
    },
    language: {
      chinese: '中文',
      english: 'EN'
    }
  },
  en: {
    initialBotMessage: 'Welcome to the uChat Enterprise Service Center. Tell us what you would like to ask and we will arrange a specialist to follow up.',
    messagePlaceholder: 'For example: I want to learn about business loan options and eligibility',
    serviceCenter: 'Service Center',
    online: 'Online',
    send: 'Send message',
    tip: 'Note: Responses on this page are for demo purposes only. Please refer to official documents and human support for formal business matters.',
    thankYou: 'Thank you for your feedback',
    thinking: 'Advisor is checking the details...',
    timeLocale: 'en-US',
    ratingLabels: {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very good',
      5: 'Excellent'
    },
    language: {
      chinese: '中文',
      english: 'EN'
    }
  }
} as const;
