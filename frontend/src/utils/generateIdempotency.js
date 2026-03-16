export const generateIdempotency = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `tv-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

