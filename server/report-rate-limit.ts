import { createHmac } from "node:crypto";

export type RateLimitResult = { allowed: boolean; retryAfter: number };

// All buckets are checked and incremented atomically across serverless instances.
export const rateLimitScript = `
for i, key in ipairs(KEYS) do
  local count = tonumber(redis.call('GET', key) or '0')
  if count >= tonumber(ARGV[(i - 1) * 2 + 1]) then
    return {0, math.max(redis.call('TTL', key), 1)}
  end
end
for i, key in ipairs(KEYS) do
  local count = redis.call('INCR', key)
  if count == 1 then redis.call('EXPIRE', key, tonumber(ARGV[(i - 1) * 2 + 2])) end
end
return {1, 0}
`;

export async function checkRateLimit(ip: string, email: string): Promise<RateLimitResult> {
  const url = process.env.RATE_LIMIT_REDIS_URL;
  const token = process.env.RATE_LIMIT_REDIS_TOKEN;
  if (!url || !token || !url.startsWith("https://")) throw new Error("Rate limiter unavailable");
  const hash = (value: string) => createHmac("sha256", token).update(value).digest("hex");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", rateLimitScript, "3",
      `cyberbilan:report:ip:${hash(ip)}`, `cyberbilan:report:email:${hash(email.toLowerCase())}`,
      "cyberbilan:report:global", "5", "3600", "3", "86400", "100", "86400"]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Rate limiter unavailable");
  const data = await response.json() as { result?: unknown; error?: unknown };
  if (data.error || !Array.isArray(data.result) || data.result.length !== 2 ||
      ![0, 1].includes(data.result[0]) || !Number.isInteger(data.result[1]) || data.result[1] < 0) {
    throw new Error("Invalid rate limiter response");
  }
  return { allowed: data.result[0] === 1, retryAfter: data.result[1] };
}
