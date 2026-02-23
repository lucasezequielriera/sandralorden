// In-memory rate limiting — works per serverless instance.
// For production-grade rate limiting, replace with @upstash/ratelimit + @upstash/redis.
// This still provides protection against rapid sequential abuse within the same instance.

const rateMap = new Map<string, { count: number; resetTime: number }>();

const CLEANUP_INTERVAL = 60_000;
const MAX_MAP_SIZE = 10_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, val] of rateMap) {
    if (now > val.resetTime) rateMap.delete(key);
  }
  if (rateMap.size > MAX_MAP_SIZE) rateMap.clear();
}

export function rateLimit(
  identifier: string,
  { maxRequests = 5, windowMs = 60_000 } = {}
): { success: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const entry = rateMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count };
}
