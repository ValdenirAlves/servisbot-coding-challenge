import { describe, it, expect } from 'vitest';
import { dataService } from './dataService';

describe('backend dataService', () => {
  it('should return all bots', async () => {
    const bots = await dataService.getBots();

    expect(Array.isArray(bots)).toBe(true);
    expect(bots.length).toBeGreaterThan(0);
  });

  it('should return a bot with workers and logs', async () => {
    const botId = '04140c19-0c46-43c6-8e78-f459cd3b3370';

    const bot = await dataService.getBotById(botId);

    expect(bot).not.toBeNull();
    expect(bot.id).toBe(botId);
    expect(Array.isArray(bot.workers)).toBe(true);
    expect(Array.isArray(bot.logs)).toBe(true);
  });

  it('should return null when bot id does not exist', async () => {
    const bot = await dataService.getBotById('invalid-id');

    expect(bot).toBeNull();
  });
});