import { quizQuestions } from "./questions";
import type { QuizQuestion } from "./schema";

export const learnerProfiles = [
  {
    id: "particulier",
    title: "Pour moi",
    description: "Protégez vos comptes, appareils et données au quotidien.",
  },
  {
    id: "salarie",
    title: "Dans mon travail",
    description: "Adoptez les bons réflexes au sein de votre organisation.",
  },
  {
    id: "tpe",
    title: "Pour mon activité",
    description: "Faites le point sur la sécurité de votre TPE ou activité indépendante.",
  },
] as const;

export type ProfileId = (typeof learnerProfiles)[number]["id"];

const excludedQuestions: Record<ProfileId, string[]> = {
  particulier: [
    "auth-4", "phish-3", "data-2", "data-6", "infra-3", "infra-4",
    "infra-5", "fin-3",
  ],
  salarie: [
    "data-2", "infra-4", "infra-5", "fin-1", "fin-3", "fin-5", "fin-6",
  ],
  tpe: ["fin-3"],
};

const questionOverrides: Partial<Record<ProfileId, Record<string, string>>> = {
  particulier: {
    "auth-1": "Comment gérez-vous les mots de passe de vos comptes personnels ?",
    "data-1": "Comment protégez-vous vos informations sensibles (identité, santé, finances) ?",
    "data-5": "Comment protégez-vous les informations sensibles lorsque vous les partagez ?",
    "infra-1": "Vos appareils sont-ils protégés par un antivirus ou une solution de sécurité à jour ?",
    "infra-6": "Verrouillez-vous vos appareils quand vous vous en absentez ?",
    "fin-1": "Comment sécurisez-vous vos comptes bancaires en ligne ?",
  },
  salarie: {
    "data-3": "Savez-vous comment les fichiers professionnels importants sont sauvegardés et restaurés ?",
  },
};

const optionOverrides: Partial<Record<ProfileId, Record<string, string[]>>> = {
  particulier: {
    "data-1": [
      "Chiffrées, avec accès limité aux seules personnes concernées",
      "Accès restreint aux personnes de confiance",
      "Accessibles sans restriction sur mes appareils ou dans le cloud",
      "Stockées dans des dossiers partagés avec un mot de passe",
    ],
    "data-5": [
      "J'utilise des messageries chiffrées pour les informations sensibles",
      "Oui, emails chiffrés et messagerie chiffrée de bout en bout",
      "Non, je partage ces informations en clair",
      "Uniquement pour les informations très sensibles",
    ],
    "infra-1": [
      "Protection à jour sur tous mes appareils, avec alertes activées",
      "La protection intégrée à mes appareils uniquement",
      "Aucune protection particulière",
      "Oui, antivirus à jour sur tous mes appareils",
    ],
    "infra-6": [
      "Oui, je les verrouille chaque fois que je m'absente",
      "Non, ils restent souvent déverrouillés",
      "Toujours, avec verrouillage automatique après quelques minutes",
      "Parfois, quand j'y pense",
    ],
  },
};

export function getQuestionsForProfile(profile: ProfileId): QuizQuestion[] {
  const excluded = new Set(excludedQuestions[profile]);
  const prompts = questionOverrides[profile] ?? {};
  const options = optionOverrides[profile] ?? {};

  return quizQuestions
    .filter((question) => !excluded.has(question.id))
    .map((question) => ({
      ...question,
      question: prompts[question.id] ?? question.question,
      options: options[question.id]
        ? question.options.map((option, index) => ({
            ...option,
            label: options[question.id][index],
          }))
        : question.options,
    }));
}
