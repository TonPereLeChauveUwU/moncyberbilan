import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../shared/questions";
import { loadQuizSession, saveQuizSession } from "../client/src/lib/quiz-session";
import { sendReport } from "../client/src/lib/send-report";
const answers = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));

test("session restores valid results but rejects corrupt, expired and incomplete sessions", () => {
  let value: string | null = null;
  const storage = { getItem: () => value, setItem: (_key: string, data: string) => { value = data; }, removeItem: () => { value = null; } };
  saveQuizSession(storage, { answers, currentIndex: 29, showResults: true });
  assert.equal(loadQuizSession(storage).showResults, true);
  assert.equal(loadQuizSession(storage, Date.now() + 25 * 3600000).showResults, false);
  value = "broken"; assert.deepEqual(loadQuizSession(storage).answers, {});
  saveQuizSession(storage, { answers: {}, currentIndex: 29, showResults: true });
  assert.deepEqual(loadQuizSession(storage), { answers: {}, currentIndex: 0, showResults: false });
  assert.equal(saveQuizSession({ setItem: () => { throw new Error("disabled"); } }, { answers, currentIndex: 0, showResults: false }), false);
});
test("client never treats HTTP failure, invalid JSON or emailSent false as success", async (t) => {
  for (const [status, body] of [[500, '{}'], [201, '{"success":true,"emailSent":false}'], [200, '<html>error</html>']] as const) {
    t.mock.method(globalThis, "fetch", async () => new Response(body, { status }));
    await assert.rejects(sendReport("test@example.com", answers)); t.mock.restoreAll();
  }
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert.deepEqual(JSON.parse(options.body as string), { email: "test@example.com", answers });
    return new Response('{"success":true,"emailSent":true}', { status: 202 });
  });
  await sendReport("test@example.com", answers);
});
