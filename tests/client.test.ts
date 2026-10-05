import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../shared/questions";
import { loadQuizSession, saveQuizSession } from "../client/src/lib/quiz-session";
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

test("old option indices are discarded when the questionnaire version changes", () => {
  let value: string | null = JSON.stringify({version: 1, savedAt: Date.now(), answers, currentIndex: 29, showResults: true});
  const storage = {getItem: () => value, removeItem: () => { value = null; }};
  assert.deepEqual(loadQuizSession(storage), {answers: {}, currentIndex: 0, showResults: false});
  assert.equal(value, null);
});
