import express from 'express';
import cors from 'cors';
import { dataService } from './services/dataService.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/bots', async (_req, res) => {
  try {
    const bots = await dataService.getBots();
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bots' });
  }
});

app.get('/api/bots/:id', async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    res.json(bot);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bot' });
  }
});

app.get('/api/bots/:id/workers', async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    const workers = await dataService.getWorkersByBotId(req.params.id);
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workers' });
  }
});

app.get('/api/bots/:id/logs', async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    const logs = await dataService.getLogsByBotId(req.params.id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

app.get('/api/bots/:id/workers/:workerId/logs', async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    const logs = await dataService.getLogsByWorkerId(
      req.params.workerId,
      req.params.id
    );

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch worker logs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});