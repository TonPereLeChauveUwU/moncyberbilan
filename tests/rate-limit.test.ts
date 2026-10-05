import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "../server/report-rate-limit";
import { sendReportEmail } from "../server/report-email";
import { calculateResult } from "../shared/quiz";
import { quizQuestions } from "../shared/questions";

test("rate limiter uses one atomic request and hashes personal identifiers", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  process.env.RATE_LIMIT_REDIS_URL = "https://limiter.example.invalid";
  process.env.RATE_LIMIT_REDIS_TOKEN = "test-only-token";
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    const body = String(options.body);
    assert.ok(!body.includes("test@example.com")); assert.ok(!body.includes("192.0.2.1"));
    const command = JSON.parse(body);
    assert.equal(command[0], "EVAL"); assert.equal(command[2], "3");
    assert.deepEqual(command.slice(6), ["5", "3600", "3", "86400", "100", "86400"]);
    return new Response('{"result":[0,300]}');
  });
  assert.deepEqual(await checkRateLimit("192.0.2.1", "test@example.com"), { allowed: false, retryAfter: 300 });
});

test("malformed or failed limiter responses fail closed", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  process.env.RATE_LIMIT_REDIS_URL = "https://limiter.example.invalid";
  process.env.RATE_LIMIT_REDIS_TOKEN = "test-only-token";
  for (const body of ['{}', '{"error":"offline"}', '{"result":[1,-1]}']) {
    t.mock.method(globalThis, "fetch", async () => new Response(body));
    await assert.rejects(checkRateLimit("192.0.2.1", "test@example.com"));
    t.mock.restoreAll();
  }
});

test("SendGrid receives a server-generated report without click or open tracking", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  process.env.SENDGRID_API_KEY = "test-only-key";
  process.env.SENDGRID_SENDER_EMAIL = "sender@example.com";
  t.mock.method(globalThis, "fetch", async (url: unknown, options: RequestInit) => {
    assert.equal(url, "https://api.sendgrid.com/v3/mail/send");
    const body = JSON.parse(String(options.body));
    assert.equal(body.tracking_settings.click_tracking.enable, false);
    assert.equal(body.tracking_settings.open_tracking.enable, false);
    assert.equal(body.personalizations[0].to[0].email, "test@example.com");
    return new Response(null, { status: 202 });
  });
  const answers = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
  assert.equal(await sendReportEmail({ ...calculateResult(answers), email: "test@example.com" }), true);
});
