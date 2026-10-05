import { test } from "node:test";
import assert from "node:assert/strict";
import type { Request, Response } from "express";
import { quizQuestions } from "../shared/questions";
import { calculateResult, reportRequestSchema } from "../shared/quiz";
import { createReportHandler } from "../server/report-handler";
import { buildEmailHtml } from "../server/report-email";

const answers = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
const valid = { email: "test@example.com", answers };
function response() {
  const result = { statusCode: 200, headers: {} as Record<string, string>, body: null as unknown };
  const res = { setHeader(k: string, v: string) { result.headers[k] = v; },
    status(code: number) { result.statusCode = code; return res; }, json(body: unknown) { result.body = body; return res; } };
  return { result, res: res as unknown as Response };
}
function request(body: unknown = valid, method = "POST", headers: Record<string, string> = {}) {
  return { method, body, headers: { "content-type": "application/json", ...headers }, ip: "127.0.0.1" } as unknown as Request;
}

test("score uses validated option indices and totals all themes", () => {
  const result = calculateResult(answers);
  assert.equal(result.score, 90); assert.equal(result.percentage, 100);
  assert.equal(result.level, "excellent"); assert.equal(result.themeScores.length, 5);
  assert.ok(result.themeScores.every((theme) => theme.score === 18));
  const weak = Object.fromEntries(quizQuestions.map((q) => [q.id, 3]));
  assert.equal(calculateResult(weak).score, 0);
  assert.equal(calculateResult(weak).level, "critique");
  assert.match(calculateResult(weak).recommendations.join(" "), /gestionnaire/);
});
test("reject incomplete, unknown, malformed or client-forged results", () => {
  for (const body of [ { ...valid, email: "a@" }, { ...valid, score: 900 },
    { ...valid, answers: {} }, { ...valid, answers: { ...answers, "auth-1": 99 } },
    { ...valid, answers: { ...answers, "auth-1": 0.5 } },
    { ...valid, answers: { ...answers, injected: 0 } }, { ...valid, answers: JSON.stringify(answers) } ]) {
    assert.equal(reportRequestSchema.safeParse(body).success, false);
  }
});
test("API does not leak contacts, accept invalid requests, or send without configuration", async () => {
  let sends = 0;
  const handler = createReportHandler({ configured: () => false, limit: async () => ({ allowed: true, retryAfter: 0 }), send: async () => { sends++; return true; } });
  for (const [req, status] of [ [request(valid, "GET"), 405], [request({}), 400],
    [request(valid, "POST", { origin: "https://attacker.invalid" }), 403],
    [request(valid, "POST", { "content-type": "text/plain" }), 415],
    [request({ ...valid, large: "x".repeat(17000) }), 413], [request(), 503] ] as const) {
    const { res, result } = response(); await handler(req, res); assert.equal(result.statusCode, status);
  }
  assert.equal(sends, 0);
});
test("rate limited and limiter-failure requests cannot send mail", async () => {
  let sends = 0;
  for (const fail of [false, true]) {
    const handler = createReportHandler({ configured: () => true,
      limit: async () => { if (fail) throw new Error("offline"); return { allowed: false, retryAfter: 120 }; },
      send: async () => { sends++; return true; } });
    const { res, result } = response(); await handler(request(), res);
    assert.equal(result.statusCode, fail ? 503 : 429);
    if (!fail) assert.equal(result.headers["Retry-After"], "120");
  }
  assert.equal(sends, 0);
});
test("email provider refusal is an error; success contains no email or answers", async () => {
  for (const accepted of [false, true]) {
    const handler = createReportHandler({ configured: () => true, limit: async () => ({ allowed: true, retryAfter: 0 }),
      send: async (data) => { assert.equal(data.score, 90); assert.equal(data.maxScore, 90); return accepted; } });
    const { res, result } = response(); await handler(request(), res);
    assert.equal(result.statusCode, accepted ? 202 : 502);
    if (accepted) assert.deepEqual(result.body, { success: true, emailSent: true });
    assert.ok(!JSON.stringify(result.body).includes(valid.email));
  }
});
test("email template escapes all text that could contain markup", () => {
  const result = calculateResult(answers);
  const html = buildEmailHtml({ ...result, email: valid.email,
    recommendations: ['<a href="https://attacker.invalid">click</a>'],
    themeScores: [{ ...result.themeScores[0], theme: "<img src=x>", themeIcon: "<svg>" }] });
  assert.ok(!html.includes('<a href="https://attacker.invalid">'));
  assert.ok(!html.includes("<img src=x>"));
  assert.ok(html.includes("&lt;img src=x&gt;"));
  assert.ok(html.includes("&lt;svg&gt;"));
});
