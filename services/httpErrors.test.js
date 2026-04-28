import { describe, it, expect, vi } from "vitest";
import {
  sendError,
  sendNotFound,
  sendBadRequest,
  sendServerError,
  sendBotNotFound,
  sendWorkerNotFoundForBot,
} from "./httpErrors";
import { ERROR_CODES, ERROR_MESSAGES } from "./errorCodes";

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("sendError", () => {
  it("should call res.status with the given status and res.json with code and message", () => {
    const res = mockRes();

    sendError(res, 418, "TEAPOT", "I'm a teapot");

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "TEAPOT", message: "I'm a teapot" },
    });
  });
});

describe("sendNotFound", () => {
  it("should respond with status 404 and the given code/message", () => {
    const res = mockRes();

    sendNotFound(res, "SOME_CODE", "Some message");

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "SOME_CODE", message: "Some message" },
    });
  });
});

describe("sendBadRequest", () => {
  it("should respond with status 400 and the given code/message", () => {
    const res = mockRes();

    sendBadRequest(res, "BAD_CODE", "Bad message");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: "BAD_CODE", message: "Bad message" },
    });
  });
});

describe("sendServerError", () => {
  it("should respond with status 500 and the INTERNAL_SERVER_ERROR code", () => {
    const res = mockRes();

    sendServerError(res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    });
  });
});

describe("sendBotNotFound", () => {
  it("should respond with status 404 and BOT_NOT_FOUND code", () => {
    const res = mockRes();

    sendBotNotFound(res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.BOT_NOT_FOUND,
        message: ERROR_MESSAGES.BOT_NOT_FOUND,
      },
    });
  });
});

describe("sendWorkerNotFoundForBot", () => {
  it("should respond with status 404 and WORKER_NOT_FOUND_FOR_BOT code", () => {
    const res = mockRes();

    sendWorkerNotFoundForBot(res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.WORKER_NOT_FOUND_FOR_BOT,
        message: ERROR_MESSAGES.WORKER_NOT_FOUND_FOR_BOT,
      },
    });
  });
});
