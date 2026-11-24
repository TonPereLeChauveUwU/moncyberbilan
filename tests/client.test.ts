import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../shared/questions";
import { getQuestionsForProfile } from "../shared/profiles";
import { loadQuizSession, saveQuizSession } from "../client/src/lib/quiz-session";
const answers = Object.fromEntries(quizQuestions.map((q) => [q.id, 0]));
const profileAnswers = Object.fromEntries(getQuestionsForProfile("particulier").map((q) => [q.id, 0]));

test("session restores valid results but rejects corrupt, expired and incomplete sessions", () => {
  let value: string | null = null;
  const storage = { getItem: () => value, setItem: (_key: string, data: string) => { value = data; }, removeItem: () => { value = null; } };
  saveQuizSession(storage, { profile: "tpe", answers, currentIndex: 29, showResults: true });
  assert.equal(loadQuizSession(storage).showResults, true);
  assert.equal(loadQuizSession(storage, Date.now() + 25 * 3600000).showResults, false);
  value = "broken"; assert.deepEqual(loadQuizSession(storage).answers, {});
  saveQuizSession(storage, { profile: null, answers: {}, currentIndex: 0, showResults: true });
  assert.deepEqual(loadQuizSession(storage), { profile: null, answers: {}, currentIndex: 0, showResults: false });
  assert.equal(saveQuizSession({ setItem: () => { throw new Error("disabled"); } }, { profile: "tpe", answers, currentIndex: 0, showResults: false }), false);
});

test("old option indices are discarded when the questionnaire version changes", () => {
  let value: string | null = JSON.stringify({version: 1, savedAt: Date.now(), answers, currentIndex: 29, showResults: true});
  const storage = {getItem: () => value, removeItem: () => { value = null; }};
  assert.deepEqual(loadQuizSession(storage), {profile: null, answers: {}, currentIndex: 0, showResults: false});
  assert.equal(value, null);
});

test("profile-aware quiz progress is restored and version-2 sessions remain usable", () => {
  let value: string | null = null;
  const storage = { getItem: () => value, setItem: (_key: string, data: string) => { value = data; }, removeItem: () => { value = null; } };
  saveQuizSession(storage, { profile: "particulier", answers: profileAnswers, currentIndex: 5, showResults: true });
  assert.deepEqual(loadQuizSession(storage), {
    profile: "particulier", answers: profileAnswers, currentIndex: 5, showResults: true,
  });
  value = JSON.stringify({ version: 2, savedAt: Date.now(), answers, currentIndex: 29, showResults: true });
  const migrated = loadQuizSession(storage);
  assert.equal(migrated.profile, "tpe");
  assert.equal(migrated.showResults, true);
});
