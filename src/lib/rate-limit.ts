type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX = 8;

export function rateLimit(key: string): {
  ok: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= MAX) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  store.set(key, existing);
  return { ok: true, retryAfterSec: 0 };
}
