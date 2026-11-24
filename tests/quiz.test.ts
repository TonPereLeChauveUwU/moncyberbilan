import { test } from "node:test";
import assert from "node:assert/strict";
import { quizQuestions } from "../shared/questions";
import { getQuestionsForProfile, learnerProfiles } from "../shared/profiles";
import { calculateResult, completeAnswersSchema, completeAnswersSchemaFor } from "../shared/quiz";
const answersFor = (profile: (typeof learnerProfiles)[number]["id"]) =>
  Object.fromEntries(getQuestionsForProfile(profile).map(q => [q.id, q.options.findIndex(option => option.value === 3)]));
const answers = Object.fromEntries(quizQuestions.map(q => [q.id, q.options.findIndex(option => option.value === 3)]));
test("score totals all themes and gives concrete recommendations", () => {
  const result = calculateResult(answers, "tpe");
  assert.equal(result.score, result.maxScore); assert.equal(result.percentage, 100);
  assert.equal(result.level, "excellent"); assert.equal(result.themeScores.length, 5);
  assert.ok(result.themeScores.every(theme => theme.score === theme.maxScore));
  const weakAnswers = Object.fromEntries(getQuestionsForProfile("tpe").map(q => [
    q.id, q.options.findIndex(option => option.value === 0),
  ]));
  const weak = calculateResult(weakAnswers, "tpe");
  assert.equal(weak.score, 0); assert.equal(weak.level, "critique");
  assert.equal(weak.recommendations.length, 3);
  assert.match(weak.recommendations.map(step => step.action).join(" "), /gestionnaire/);
});
test("rejects incomplete, unknown and malformed answers", () => {
  for (const value of [{}, {...answers, "auth-1": 99}, {...answers, "auth-1": 0.5},
    {...answers, injected: 0}, JSON.stringify(answers)]) {
    assert.equal(completeAnswersSchema.safeParse(value).success, false);
  }
  assert.equal(completeAnswersSchemaFor("particulier").safeParse(answersFor("particulier")).success, true);
  const incompletePersonal = answersFor("particulier");
  delete incompletePersonal["fin-4"];
  assert.equal(completeAnswersSchemaFor("particulier").safeParse(incompletePersonal).success, false);
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

test("profiles select relevant questions and calculate a tailored learning path", () => {
  const personalQuestions = getQuestionsForProfile("particulier");
  const employeeQuestions = getQuestionsForProfile("salarie");
  assert.ok(personalQuestions.length < quizQuestions.length);
  assert.ok(employeeQuestions.length < quizQuestions.length);
  assert.ok(!personalQuestions.some(question => question.id === "data-2"));
  assert.ok(!employeeQuestions.some(question => question.id === "fin-1"));
  assert.match(personalQuestions.find(question => question.id === "auth-1")!.question, /personnels/);
  for (const profile of learnerProfiles) {
    const result = calculateResult(answersFor(profile.id), profile.id);
    assert.equal(result.percentage, 100);
    assert.equal(result.themeScores.length, 5);
    assert.ok(result.recommendations.length > 0);
  }
});
