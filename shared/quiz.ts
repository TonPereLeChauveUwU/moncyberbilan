import { z } from "zod";
import { quizQuestions, themes } from "./questions";
import type { QuizResult } from "./schema";

export type Answers = Record<string, number>;
export const answersSchema = z.record(z.number().int().nonnegative()).superRefine((answers, ctx) => {
  for (const [id, index] of Object.entries(answers)) {
    const question = quizQuestions.find((q) => q.id === id);
    if (!question || index >= question.options.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Réponse inconnue", path: [id] });
    }
  }
});
export const completeAnswersSchema = answersSchema.refine(
  (answers) => quizQuestions.every((q) => Object.hasOwn(answers, q.id)),
  "Répondez à toutes les questions avant de demander votre rapport.",
);
export const reportRequestSchema = z.object({
  email: z.string().trim().email().max(254),
  answers: completeAnswersSchema,
}).strict();

const actions: Record<string, string> = {
  "auth-1": "Utilisez un gestionnaire de mots de passe et un mot de passe différent pour chaque compte.",
  "auth-2": "Activez la double authentification sur votre messagerie et vos comptes importants.",
  "phish-1": "Signalez les messages suspects à votre équipe informatique sans ouvrir leurs liens.",
  "phish-4": "Vérifiez toute demande de virement urgente par un autre canal connu.",
  "data-1": "Limitez l'accès aux données sensibles aux seules personnes qui en ont besoin.",
  "data-3": "Automatisez vos sauvegardes, gardez une copie hors ligne et testez leur restauration.",
  "infra-2": "Activez les mises à jour automatiques et planifiez celles qui nécessitent un redémarrage.",
  "infra-6": "Activez le verrouillage automatique de votre poste et verrouillez-le en vous absentant.",
  "fin-2": "Rappelez votre banque avec un numéro connu avant de répondre à une demande inhabituelle.",
  "fin-4": "Confirmez tout nouveau RIB auprès du bénéficiaire par un canal indépendant.",
};

/** Only option indices are accepted; totals and email text never come from the client. */
export function calculateResult(input: Answers): QuizResult {
  const answers = completeAnswersSchema.parse(input);
  const scoreFor = (id: string) => {
    const q = quizQuestions.find((question) => question.id === id)!;
    return q.options[answers[id]].value;
  };
  const maxScore = quizQuestions.length * 3;
  const score = quizQuestions.reduce((sum, q) => sum + scoreFor(q.id), 0);
  const percentage = Math.round(score / maxScore * 100);
  const themeScores = themes.map((theme) => {
    const questions = quizQuestions.filter((q) => q.theme === theme);
    const total = questions.reduce((sum, q) => sum + scoreFor(q.id), 0);
    return { theme, themeIcon: questions[0].themeIcon, score: total,
      maxScore: questions.length * 3, percentage: Math.round(total / (questions.length * 3) * 100) };
  });
  const recommendations = quizQuestions
    .filter((q) => scoreFor(q.id) < 3 && actions[q.id])
    .sort((a, b) => scoreFor(a.id) - scoreFor(b.id))
    .slice(0, 5).map((q) => actions[q.id]);
  if (!recommendations.length) recommendations.push("Maintenez vos bonnes pratiques et réévaluez-les régulièrement avec votre équipe informatique.");
  const level = percentage >= 85 ? "excellent" : percentage >= 70 ? "bon" : percentage >= 50 ? "moyen" : percentage >= 30 ? "faible" : "critique";
  return { score, maxScore, percentage, level, themeScores, recommendations };
}
