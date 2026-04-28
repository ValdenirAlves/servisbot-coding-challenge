import { describe, it, expect } from "vitest";
import { dataService } from "./dataService";

const BOT_ONE_ID = "04140c19-0c46-43c6-8e78-f459cd3b3370";
const BOT_TWO_ID = "22526dec-4e04-4815-a641-ee6c71cbc5a9";
// Worker One belongs to Bot One; Worker Seven belongs to Bot Two.
const WORKER_ONE_ID = "6f4fdfd9-da33-4711-9386-579e8101dc43";
const WORKER_SEVEN_ID = "0fb5c514-eeaf-4cc2-b23a-20cdc04cbe17";

describe("dataService.getBots", () => {
  it("should return all bots as a non-empty array", async () => {
    const bots = await dataService.getBots();

    expect(Array.isArray(bots)).toBe(true);
    expect(bots.length).toBeGreaterThan(0);
  });
});

describe("dataService.getBotById", () => {
  it("should return a bot with workers and logs arrays", async () => {
    const bot = await dataService.getBotById(BOT_ONE_ID);

    expect(bot).not.toBeNull();
    expect(bot.id).toBe(BOT_ONE_ID);
    expect(Array.isArray(bot.workers)).toBe(true);
    expect(Array.isArray(bot.logs)).toBe(true);
  });

  it("should return null for an unknown bot id", async () => {
    const bot = await dataService.getBotById("unknown-id");

    expect(bot).toBeNull();
  });
});

describe("dataService.getWorkersByBotId", () => {
  it("should return workers that all belong to the requested bot", async () => {
    const workers = await dataService.getWorkersByBotId(BOT_ONE_ID);

    expect(Array.isArray(workers)).toBe(true);
    expect(workers.length).toBeGreaterThan(0);
    workers.forEach((w) => expect(w.bot).toBe("Bot One"));
  });

  it("should return an empty array for an unknown bot id", async () => {
    const workers = await dataService.getWorkersByBotId("unknown-id");

    expect(workers).toEqual([]);
  });
});

describe("dataService.getLogsByBotId", () => {
  it("should return paginated logs sorted newest-first", async () => {
    const result = await dataService.getLogsByBotId(BOT_ONE_ID, {
      page: 1,
      limit: 5,
    });

    expect(result.data.length).toBeLessThanOrEqual(5);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(5);
    expect(result.pagination).toHaveProperty("total");
    expect(result.pagination).toHaveProperty("totalPages");
    expect(result.pagination).toHaveProperty("hasNextPage");
    expect(result.pagination).toHaveProperty("hasPreviousPage");
  });

  it("should return logs sorted from newest to oldest", async () => {
    const result = await dataService.getLogsByBotId(BOT_ONE_ID, {
      page: 1,
      limit: 100,
    });

    const dates = result.data.map((l) => new Date(l.created).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it("should return empty data with correct pagination for an unknown bot id", async () => {
    const result = await dataService.getLogsByBotId("unknown-id", {
      page: 1,
      limit: 10,
    });

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });

  it("should use default pagination when options are omitted", async () => {
    const result = await dataService.getLogsByBotId(BOT_ONE_ID);

    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("pagination");
  });
});

describe("dataService.getLogsByWorkerId", () => {
  it("should return paginated logs for a worker", async () => {
    const result = await dataService.getLogsByWorkerId(WORKER_ONE_ID, null, {
      page: 1,
      limit: 5,
    });

    expect(result.data.length).toBeLessThanOrEqual(5);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(5);
    expect(result.pagination).toHaveProperty("total");
    expect(result.pagination).toHaveProperty("totalPages");
  });

  it("should scope logs to the given botId when provided", async () => {
    const scoped = await dataService.getLogsByWorkerId(
      WORKER_ONE_ID,
      BOT_ONE_ID,
      { page: 1, limit: 100 }
    );

    // Every scoped log must reference the correct bot.
    scoped.data.forEach((log) => expect(log.bot).toBe(BOT_ONE_ID));
    // Scoped result must be a subset of (or equal to) the unscoped result.
    const unscoped = await dataService.getLogsByWorkerId(WORKER_ONE_ID, null, {
      page: 1,
      limit: 100,
    });
    expect(scoped.pagination.total).toBeLessThanOrEqual(unscoped.pagination.total);
  });

  it("should return empty data when botId does not match any log for the worker", async () => {
    // An unknown botId will never match any log's bot field.
    const result = await dataService.getLogsByWorkerId(
      WORKER_SEVEN_ID,
      "unknown-bot-id",
      { page: 1, limit: 10 }
    );

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  it("should return empty data for an unknown worker id", async () => {
    const result = await dataService.getLogsByWorkerId("unknown-worker", null, {
      page: 1,
      limit: 10,
    });

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  it("should return logs sorted from newest to oldest", async () => {
    const result = await dataService.getLogsByWorkerId(WORKER_ONE_ID, null, {
      page: 1,
      limit: 100,
    });

    const dates = result.data.map((l) => new Date(l.created).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });
});
