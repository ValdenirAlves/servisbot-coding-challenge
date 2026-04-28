import { ERROR_CODES, ERROR_MESSAGES } from './errorCodes.js';

// base
export const sendError = (res, status, code, message) => {
  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
};

// generic helpers
export const sendNotFound = (res, code, message) => {
  return sendError(res, 404, code, message);
};

export const sendBadRequest = (res, code, message) => {
  return sendError(res, 400, code, message);
};

export const sendServerError = (res) => {
  return sendError(
    res,
    500,
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  );
};

// specific helpers
export const sendBotNotFound = (res) =>
  sendNotFound(
    res,
    ERROR_CODES.BOT_NOT_FOUND,
    ERROR_MESSAGES.BOT_NOT_FOUND
  );

export const sendWorkerNotFoundForBot = (res) =>
  sendNotFound(
    res,
    ERROR_CODES.WORKER_NOT_FOUND_FOR_BOT,
    ERROR_MESSAGES.WORKER_NOT_FOUND_FOR_BOT
  );