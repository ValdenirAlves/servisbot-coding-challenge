export const paginate = (items, page = 1, limit = 50) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const total = items.length;
  const totalPages = Math.ceil(total / safeLimit);
  const startIndex = (safePage - 1) * safeLimit;
  const data = items.slice(startIndex, startIndex + safeLimit);

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
};