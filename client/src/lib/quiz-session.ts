import { z } from "zod";
import { answersSchema, completeAnswersSchemaFor, type Answers } from "../../../shared/quiz";
import { quizQuestions } from "../../../shared/questions";
import { getQuestionsForProfile, learnerProfiles, type ProfileId } from "../../../shared/profiles";

const KEY = "cyberbilan.quiz.v1";
const MAX_AGE = 24 * 60 * 60 * 1000;
export type QuizSession = { profile: ProfileId | null; answers: Answers; currentIndex: number; showResults: boolean };
const profileSchema = z.enum(learnerProfiles.map((profile) => profile.id) as [ProfileId, ...ProfileId[]]);
const legacySchema = z.object({
  version: z.literal(2), savedAt: z.number().finite(), answers: answersSchema,
  currentIndex: z.number().int().min(0).max(quizQuestions.length - 1), showResults: z.boolean(),
});
const schema = z.object({
  version: z.literal(3), savedAt: z.number().finite(), profile: profileSchema.nullable(), answers: answersSchema,
  currentIndex: z.number().int().min(0).max(quizQuestions.length - 1), showResults: z.boolean(),
});
export const emptySession = (): QuizSession => ({ profile: null, answers: {}, currentIndex: 0, showResults: false });
export function loadQuizSession(storage: Pick<Storage, "getItem" | "removeItem">, now = Date.now()): QuizSession {
  try {
    const raw = JSON.parse(storage.getItem(KEY) || "null");
    const current = schema.safeParse(raw);
    const legacy = legacySchema.safeParse(raw);
    let profile: ProfileId | null;
    let savedAt: number;
    let storedAnswers: Answers;
    let storedIndex: number;
    let storedResults: boolean;
    if (current.success) {
      ({ profile, savedAt, answers: storedAnswers, currentIndex: storedIndex, showResults: storedResults } = current.data);
    } else if (legacy.success) {
      ({ savedAt, answers: storedAnswers, currentIndex: storedIndex, showResults: storedResults } = legacy.data);
      profile = "tpe";
    } else {
      throw new Error("Invalid session");
    }
    if (savedAt > now || now - savedAt > MAX_AGE) throw new Error("Expired");
    if (!profile) return emptySession();
    const questions = getQuestionsForProfile(profile);
    const answers = Object.fromEntries(questions
      .filter((question) => storedAnswers[question.id] !== undefined)
      .map((question) => [question.id, storedAnswers[question.id]]));
    const firstMissing = questions.findIndex((question) => answers[question.id] === undefined);
    const currentIndex = Math.min(storedIndex, questions.length - 1);
    const complete = completeAnswersSchemaFor(profile).safeParse(answers).success;
    return {
      profile,
      answers,
      currentIndex: firstMissing < 0 ? currentIndex : Math.min(firstMissing, currentIndex),
      showResults: storedResults && complete,
    };
  } catch {
    try { storage.removeItem(KEY); } catch { /* Storage may be disabled. */ }
    return emptySession();
  }
}
export function saveQuizSession(storage: Pick<Storage, "setItem">, session: QuizSession): boolean {
  try { storage.setItem(KEY, JSON.stringify({ ...session, version: 3, savedAt: Date.now() })); return true; }
  catch { return false; }
}
