type Key = string;

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const maxRequests = Number(process.env.RATE_LIMIT_REQUESTS || 100);

// very small in-memory sliding window, not suitable for multi-instance production
const store = new Map<Key, { count: number; start: number }>();

export const rateLimiter = {
  check(key: Key) {
    const now = Date.now();
    const entry = store.get(key);
    if (!entry) {
      store.set(key, { count: 1, start: now });
      return true;
    }
    if (now - entry.start > windowMs) {
      store.set(key, { count: 1, start: now });
      return true;
    }
    if (entry.count + 1 > maxRequests) return false;
    entry.count += 1;
    return true;
  }
};
