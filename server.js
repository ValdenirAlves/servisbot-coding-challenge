import express from "express";
import cors from "cors";
import { dataService } from "./services/dataService.js";
import { sendError, sendBotNotFound, sendWorkerNotFoundForBot, sendServerError} from "./services/httpErrors.js";
import { parsePagination } from "./services/paginationValidation.js";
import { ERROR_CODES, ERROR_MESSAGES } from "./services/errorCodes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/bots", async (_req, res) => {
  try {
    const bots = await dataService.getBots();
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bots" });
  }
});

app.get("/api/bots/:id", async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return sendBotNotFound(res);
    }

    res.json(bot);
  } catch (error) {
    console.error('Error fetching bots:', error);
    return sendServerError(res);
  }
});

app.get("/api/bots/:id/workers", async (req, res) => {
  try {
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return sendBotNotFound(res);
    }

    const workers = await dataService.getWorkersByBotId(req.params.id);
    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    return sendServerError(res);
  }
});

app.get("/api/bots/:id/logs", async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    if (pagination.error) {
      return sendError(
        res,
        400,
        ERROR_CODES.INVALID_QUERY_PARAMS,
        pagination.error,
      );
    }

    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return sendBotNotFound(res);
    }

    const result = await dataService.getLogsByBotId(req.params.id, pagination);

    res.json(result);
  } catch (error) {
    console.error('Error fetching Bot logs:', error);
    return sendServerError(res);
  }
});

app.get("/api/bots/:id/workers/:workerId/logs", async (req, res) => {
  try {
    const pagination = parsePagination(req.query);

    if (pagination.error) {
      return sendError(
        res,
        400,
        ERROR_CODES.INVALID_QUERY_PARAMS,
        pagination.error,
      );
    }
    
    const bot = await dataService.getBotById(req.params.id);

    if (!bot) {
      return sendBotNotFound(res);
    }

    const workers = await dataService.getWorkersByBotId(req.params.id);

    const workerBelongsToBot = workers.some(
      worker => worker.id === req.params.workerId
    );

    if (!workerBelongsToBot) {
      return sendWorkerNotFoundForBot(res)
    }

    const result = await dataService.getLogsByWorkerId(
      req.params.workerId,
      req.params.id,
      pagination
    );

    res.json(result);
  } catch (error) {
    console.error('Error fetching workers logs:', error);
    return sendServerError(res);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
