import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../shared/questions";
import { calculateResult, completeAnswersSchema } from "../shared/quiz";
const answers = Object.fromEntries(quizQuestions.map(q => [q.id, q.options.findIndex(option => option.value === 3)]));
test("score totals all themes and gives concrete recommendations", () => {
  const result = calculateResult(answers);
  assert.equal(result.score, 90); assert.equal(result.percentage, 100);
  assert.equal(result.level, "excellent"); assert.equal(result.themeScores.length, 5);
  assert.ok(result.themeScores.every(theme => theme.score === 18));
  const weak = calculateResult(Object.fromEntries(quizQuestions.map(q => [q.id, q.options.findIndex(option => option.value === 0)])));
  assert.equal(weak.score, 0); assert.equal(weak.level, "critique");
  assert.match(weak.recommendations.join(" "), /gestionnaire/);
});
test("rejects incomplete, unknown and malformed answers", () => {
  for (const value of [{}, {...answers, "auth-1": 99}, {...answers, "auth-1": 0.5},
    {...answers, injected: 0}, JSON.stringify(answers)]) {
    assert.equal(completeAnswersSchema.safeParse(value).success, false);
  }
});

test("best answers are balanced across positions and first-choice-only cannot ace the quiz", () => {
  const positions = [0, 0, 0, 0];
  for (const question of quizQuestions) {
    assert.deepEqual(question.options.map(option => option.value).sort(), [0, 1, 2, 3]);
    positions[question.options.findIndex(option => option.value === 3)]++;
  }
  assert.ok(positions.every(count => count >= 7 && count <= 8));
  const firstOnly = Object.fromEntries(quizQuestions.map(q => [q.id, 0]));
  assert.ok(calculateResult(firstOnly).percentage < 70);
});
