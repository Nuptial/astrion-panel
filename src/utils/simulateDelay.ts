export const simulateDelay = async <T>(result: T, duration = 400): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(result), duration);
  });

