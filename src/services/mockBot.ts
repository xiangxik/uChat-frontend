const quickReplyMap: Record<string, string> = {
  贷款: '我们可以为你介绍个人贷款、按揭及中小企融资服务。请告诉我你的预算范围，我会先给出建议方向。',
  信用卡: '如需比较信用卡礼遇，我可以按你的消费场景推荐适合的卡种。',
  投资: '我可以先提供一般资讯，包括风险等级与产品类别；正式建议请以顾问会面为准。',
  开户: '你可以通过线上预约分行办理开户。如需，我可以列出所需文件清单。'
};

export async function generateBotReply(input: string): Promise<string> {
  const cleaned = input.trim();
  if (!cleaned) {
    return '请先输入你的问题，我会即时为你整理相关资讯。';
  }

  await new Promise((resolve) => setTimeout(resolve, 550));

  const match = Object.keys(quickReplyMap).find((key) => cleaned.includes(key));
  if (match) {
    return quickReplyMap[match];
  }

  return '已收到你的查询。我建议先从服务类别、预算与时程三个方向厘清需求，我可以继续一步步协助你。';
}
