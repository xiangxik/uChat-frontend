import { describe, expect, it, vi, afterEach } from 'vitest';
import { createMessage, formatMessageTime } from './chat';

describe('chat utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a message with ISO timestamp and stable id prefix', () => {
    const fixedDate = new Date('2026-01-02T03:04:05.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);

    const message = createMessage('bot', 'hello');

    expect(message.sender).toBe('bot');
    expect(message.content).toBe('hello');
    expect(message.id.startsWith('bot-')).toBe(true);
    expect(message.timestamp).toBe(fixedDate.toISOString());
  });

  it('formats timestamps by locale without throwing', () => {
    const iso = '2026-01-02T03:04:05.000Z';
    const zhTime = formatMessageTime(iso, 'zh');
    const enTime = formatMessageTime(iso, 'en');

    expect(typeof zhTime).toBe('string');
    expect(typeof enTime).toBe('string');
    expect(zhTime.length).toBeGreaterThan(0);
    expect(enTime.length).toBeGreaterThan(0);
  });
});
