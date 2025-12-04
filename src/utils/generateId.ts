export const generateId = (): string => {
  const random = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}-${random}`;
};

