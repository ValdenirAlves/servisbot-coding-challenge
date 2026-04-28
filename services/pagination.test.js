import { describe, it, expect } from "vitest";
import { paginate } from "./pagination";

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

describe("paginate", () => {
  it("should return the first page with default limit", () => {
    const items = range(20);
    const result = paginate(items);

    expect(result.data.length).toBeLessThanOrEqual(50);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.total).toBe(20);
    expect(result.pagination.totalPages).toBe(1);
  });

  it("should slice items correctly for page 1", () => {
    const items = range(10);
    const result = paginate(items, 1, 3);

    expect(result.data).toEqual([1, 2, 3]);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(3);
    expect(result.pagination.total).toBe(10);
    expect(result.pagination.totalPages).toBe(4);
  });

  it("should slice items correctly for page 2", () => {
    const items = range(10);
    const result = paginate(items, 2, 3);

    expect(result.data).toEqual([4, 5, 6]);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.hasPreviousPage).toBe(true);
    expect(result.pagination.hasNextPage).toBe(true);
  });

  it("should return the last partial page correctly", () => {
    const items = range(10);
    const result = paginate(items, 4, 3);

    expect(result.data).toEqual([10]);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });

  it("should return empty data when page is beyond totalPages", () => {
    const items = range(5);
    const result = paginate(items, 99, 5);

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(5);
    expect(result.pagination.hasNextPage).toBe(false);
  });

  it("should return empty data and zero totalPages for empty array", () => {
    const result = paginate([], 1, 10);

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it("should clamp limit to a maximum of 100", () => {
    const items = range(200);
    const result = paginate(items, 1, 9999);

    expect(result.data.length).toBe(100);
    expect(result.pagination.limit).toBe(100);
  });

  it("should fall back to default limit of 10 when limit is 0 (falsy)", () => {
    const items = range(20);
    const result = paginate(items, 1, 0);

    expect(result.pagination.limit).toBe(10);
  });

  it("should clamp limit to a minimum of 1 when limit is negative", () => {
    const items = range(5);
    const result = paginate(items, 1, -5);

    expect(result.data.length).toBe(1);
    expect(result.pagination.limit).toBe(1);
  });

  it("should treat page < 1 as page 1", () => {
    const items = range(5);
    const result = paginate(items, -5, 10);

    expect(result.pagination.page).toBe(1);
    expect(result.data).toEqual(items);
  });

  it("should treat non-numeric page as page 1", () => {
    const items = range(5);
    const result = paginate(items, "abc", 10);

    expect(result.pagination.page).toBe(1);
  });

  it("should treat non-numeric limit as default 10", () => {
    const items = range(20);
    const result = paginate(items, 1, "abc");

    expect(result.pagination.limit).toBe(10);
  });

  it("hasPreviousPage should be false on page 1", () => {
    const items = range(10);
    const result = paginate(items, 1, 5);

    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it("hasNextPage should be false on the last page", () => {
    const items = range(10);
    const result = paginate(items, 2, 5);

    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });
});
