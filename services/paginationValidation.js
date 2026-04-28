export const parsePagination = (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    return {
      error: 'page must be a positive integer',
    };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return {
      error: 'limit must be between 1 and 100',
    };
  }

  return { page, limit };
};