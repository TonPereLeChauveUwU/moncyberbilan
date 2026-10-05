import { z } from "zod";
import { answersSchema, completeAnswersSchema, type Answers } from "../../../shared/quiz";
import { quizQuestions } from "../../../shared/questions";

const KEY = "cyberbilan.quiz.v1";
const MAX_AGE = 24 * 60 * 60 * 1000;
export type QuizSession = { answers: Answers; currentIndex: number; showResults: boolean };
const schema = z.object({
  version: z.literal(1), savedAt: z.number().finite(), answers: answersSchema,
  currentIndex: z.number().int().min(0).max(quizQuestions.length - 1), showResults: z.boolean(),
});
export const emptySession = (): QuizSession => ({ answers: {}, currentIndex: 0, showResults: false });
export function loadQuizSession(storage: Pick<Storage, "getItem" | "removeItem">, now = Date.now()): QuizSession {
  try {
    const data = schema.parse(JSON.parse(storage.getItem(KEY) || "null"));
    if (data.savedAt > now || now - data.savedAt > MAX_AGE) throw new Error("Expired");
    const firstMissing = quizQuestions.findIndex((q) => data.answers[q.id] === undefined);
    return { answers: data.answers, currentIndex: firstMissing < 0 ? data.currentIndex : Math.min(firstMissing, data.currentIndex),
      showResults: data.showResults && completeAnswersSchema.safeParse(data.answers).success };
  } catch {
    try { storage.removeItem(KEY); } catch { /* Storage may be disabled. */ }
    return emptySession();
  }
}
export function saveQuizSession(storage: Pick<Storage, "setItem">, session: QuizSession): boolean {
  try { storage.setItem(KEY, JSON.stringify({ ...session, version: 1, savedAt: Date.now() })); return true; }
  catch { return false; }
}
