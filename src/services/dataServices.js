import botsData from '../data/bots.json';
import workersData from '../data/workers.json';
import logsData from '../data/logs.json';

// Precompute lookups to avoid repeated array scans during reads.
const botsById = Object.fromEntries(
  botsData.map(bot => [bot.id, bot])
);

const botsByName = Object.fromEntries(
  botsData.map(bot => [bot.name, bot])
);

// Workers reference bots by name instead of ID in the dataset,
// so we normalize that relationship here.
const workersByBotId = workersData.reduce((acc, worker) => {
  const bot = botsByName[worker.bot];

  if (!bot) return acc;

  if (!acc[bot.id]) acc[bot.id] = [];
  acc[bot.id].push(worker);

  return acc;
}, {});

const logsByBotId = logsData.reduce((acc, log) => {
  if (!acc[log.bot]) acc[log.bot] = [];
  acc[log.bot].push(log);

  return acc;
}, {});

const logsByWorkerId = logsData.reduce((acc, log) => {
  if (!acc[log.worker]) acc[log.worker] = [];
  acc[log.worker].push(log);

  return acc;
}, {});


export const dataService = {
  async getBots() {
    return botsData;
  },

  async getBotById(id) {
    const bot = botsById[id];
    if (!bot) return null;

    const workers = workersByBotId[id] || [];
    const logs = logsByBotId[id] || [];

    return {
      ...bot,
      workers,
      logs
    };
  },

  async getWorkersByBotId(botId) {
    return workersByBotId[botId] || [];
  },

  async getLogsByBotId(botId) {
    return logsByBotId[botId] || [];
  },

  async getLogsByWorkerId(workerId, botId = null) {
    const logs = logsByWorkerId[workerId] || [];

    if (!botId) return logs;

    return logs.filter(log => log.bot === botId);
  }
};