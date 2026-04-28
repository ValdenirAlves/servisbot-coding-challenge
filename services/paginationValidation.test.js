import { describe, it, expect } from "vitest";
import { parsePagination } from "./paginationValidation";

describe("parsePagination", () => {
  it("should return default page=1 and limit=10 when query is empty", () => {
    const result = parsePagination({});

    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it("should parse valid page and limit from string query params", () => {
    const result = parsePagination({ page: "2", limit: "25" });

    expect(result).toEqual({ page: 2, limit: 25 });
  });

  it("should parse numeric page and limit directly", () => {
    const result = parsePagination({ page: 3, limit: 50 });

    expect(result).toEqual({ page: 3, limit: 50 });
  });

  it("should return an error when page is 0", () => {
    const result = parsePagination({ page: "0", limit: "10" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/page/i);
  });

  it("should return an error when page is negative", () => {
    const result = parsePagination({ page: "-1", limit: "10" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/page/i);
  });

  it("should return an error when page is a non-integer float", () => {
    const result = parsePagination({ page: "1.5", limit: "10" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/page/i);
  });

  it("should return an error when page is not a number", () => {
    const result = parsePagination({ page: "abc", limit: "10" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/page/i);
  });

  it("should return an error when limit is 0", () => {
    const result = parsePagination({ page: "1", limit: "0" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/limit/i);
  });

  it("should return an error when limit is negative", () => {
    const result = parsePagination({ page: "1", limit: "-5" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/limit/i);
  });

  it("should return an error when limit exceeds 100", () => {
    const result = parsePagination({ page: "1", limit: "101" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/limit/i);
  });

  it("should accept limit equal to 100 as valid", () => {
    const result = parsePagination({ page: "1", limit: "100" });

    expect(result).toEqual({ page: 1, limit: 100 });
  });

  it("should accept limit equal to 1 as valid", () => {
    const result = parsePagination({ page: "1", limit: "1" });

    expect(result).toEqual({ page: 1, limit: 1 });
  });

  it("should return an error when limit is a non-integer float", () => {
    const result = parsePagination({ page: "1", limit: "5.5" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/limit/i);
  });

  it("should return an error when limit is not a number", () => {
    const result = parsePagination({ page: "1", limit: "xyz" });

    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/limit/i);
  });
});
