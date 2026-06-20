const quickReplyMap = {
  zh: {
    贷款: '我们可以为你介绍个人贷款、按揭及中小企融资服务。请告诉我你的预算范围，我会先给出建议方向。',
    信用卡: '如需比较信用卡礼遇，我可以按你的消费场景推荐适合的卡种。',
    投资: '我可以先提供一般资讯，包括风险等级与产品类别；正式建议请以顾问会面为准。',
    开户: '你可以通过线上预约分行办理开户。如需，我可以列出所需文件清单。'
  },
  en: {
    loan: 'We can walk you through personal loans, mortgages, and SME financing. Share your budget range and I will suggest a direction first.',
    credit: 'If you want to compare card benefits, I can recommend suitable cards based on your spending habits.',
    investment: 'I can provide general information, including risk levels and product categories; formal advice should be confirmed with a consultant.',
    account: 'You can book an appointment to open an account at a branch. If needed, I can list the required documents.'
  }
};

export async function generateBotReply(input: string, locale: 'zh' | 'en'): Promise<string> {
  const cleaned = input.trim();
  if (!cleaned) {
    return locale === 'en'
      ? 'Please type your question first. I will organize the relevant information for you right away.'
      : '请先输入你的问题，我会即时为你整理相关资讯。';
  }

  await new Promise((resolve) => setTimeout(resolve, 550));

  const map = quickReplyMap[locale];
  const match = Object.keys(map).find((key) => cleaned.toLowerCase().includes(key.toLowerCase()));
  if (match) {
    return map[match as keyof typeof map];
  }

  return locale === 'en'
    ? 'I have received your query. I suggest clarifying the service type, budget, and timeline first, and I can guide you step by step from there.'
    : '已收到你的查询。我建议先从服务类别、预算与时程三个方向厘清需求，我可以继续一步步协助你。';
}

export async function submitBotFeedback(messageId: string, rating: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  console.log('mock feedback submitted', { messageId, rating });
}
