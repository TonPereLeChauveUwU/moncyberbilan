import { z } from "zod";
import { quizQuestions, themes } from "./questions";
import { getQuestionsForProfile, type ProfileId } from "./profiles";
import type { LearningStep, QuizResult } from "./schema";

export type Answers = Record<string, number>;
export const answersSchema = z.record(z.number().int().nonnegative()).superRefine((answers, ctx) => {
  for (const [id, index] of Object.entries(answers)) {
    const question = quizQuestions.find((q) => q.id === id);
    if (!question || index >= question.options.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Réponse inconnue", path: [id] });
    }
  }
});
export function completeAnswersSchemaFor(profile: ProfileId) {
  const questions = getQuestionsForProfile(profile);
  return answersSchema.refine(
    (answers) => questions.every((question) => Object.hasOwn(answers, question.id)),
    "Répondez à toutes les questions avant de consulter votre bilan.",
  );
}

export const completeAnswersSchema = completeAnswersSchemaFor("tpe");

const actions: Record<string, Omit<LearningStep, "theme">> = {
  "auth-1": { title: "Mieux gérer vos mots de passe", why: "Un mot de passe réutilisé peut exposer plusieurs comptes à la fois.", action: "Utilisez un gestionnaire pour créer un mot de passe unique par compte." },
  "auth-2": { title: "Ajouter une seconde protection", why: "Un second facteur peut bloquer l'accès même si un mot de passe est compromis.", action: "Activez l'authentification à deux facteurs sur votre messagerie et vos comptes importants." },
  "auth-3": { title: "Privilégier des mots de passe longs et uniques", why: "La longueur et l'unicité rendent les mots de passe plus difficiles à deviner et limitent les dégâts d'une fuite.", action: "Laissez votre gestionnaire générer des mots de passe longs et uniques." },
  "auth-4": { title: "Partager les accès sans exposer les mots de passe", why: "Un message ou un document partagé peut être transféré ou consulté par erreur.", action: "Utilisez le partage sécurisé d'un gestionnaire et retirez l'accès quand il n'est plus nécessaire." },
  "auth-5": { title: "Changer un mot de passe en cas de risque", why: "Un changement systématique sans signe de compromission apporte peu ; réagir vite à une alerte est essentiel.", action: "Changez immédiatement tout mot de passe signalé comme compromis et activez la 2FA." },
  "auth-6": { title: "Vérifier les fuites de comptes", why: "Une fuite connue peut rendre un mot de passe réutilisé exploitable.", action: "Vérifiez vos adresses avec un service reconnu et changez les mots de passe concernés." },
  "phish-1": { title: "Prendre le temps de vérifier un message", why: "Les messages frauduleux jouent souvent sur l'urgence pour provoquer un clic.", action: "N'ouvrez pas les liens ; vérifiez la demande via un canal connu et signalez le message si possible." },
  "phish-2": { title: "Ne pas se fier uniquement au cadenas", why: "Le cadenas chiffre la connexion, mais ne garantit pas que le site est légitime.", action: "Vérifiez le nom de domaine complet et ouvrez le site depuis un favori ou une adresse connue." },
  "phish-3": { title: "S'entraîner à repérer les tentatives de phishing", why: "Des exemples réguliers aident à reconnaître les demandes inhabituelles avant d'agir.", action: "Suivez une sensibilisation adaptée à votre organisation et apprenez comment signaler un message." },
  "phish-4": { title: "Vérifier les demandes urgentes de paiement", why: "Une demande crédible peut provenir d'un compte usurpé ou compromis.", action: "Confirmez tout virement par un numéro ou un canal déjà connu, jamais par les coordonnées du message." },
  "phish-5": { title: "Reconnaître les arnaques par téléphone et SMS", why: "Les fraudeurs utilisent aussi les appels et textos pour pousser à partager un code ou agir vite.", action: "Ne communiquez jamais un code reçu et rappelez l'organisme à partir de son numéro officiel." },
  "phish-6": { title: "Vérifier les pièces jointes inattendues", why: "Un document inattendu peut contenir un lien ou un fichier malveillant, même s'il semble venir d'un contact.", action: "Confirmez l'envoi avec la personne par un canal séparé avant d'ouvrir la pièce jointe." },
  "data-1": { title: "Limiter l'accès aux informations sensibles", why: "Moins une donnée est accessible, moins elle risque d'être exposée par erreur.", action: "Partagez les fichiers sensibles uniquement avec les personnes qui en ont besoin et protégez les appareils qui les contiennent." },
  "data-2": { title: "Identifier les règles de protection des données", why: "Des règles claires aident à savoir quelles données collecter, protéger et supprimer.", action: "Demandez à votre organisation où trouver sa politique de protection des données et qui contacter." },
  "data-3": { title: "Préparer la récupération des fichiers", why: "Une sauvegarde n'est utile que si elle est disponible et peut être restaurée.", action: "Vérifiez où se trouvent les sauvegardes et demandez comment restaurer un fichier perdu." },
  "data-4": { title: "Supprimer les données selon leur sensibilité", why: "Une suppression ordinaire ne garantit pas toujours l'effacement, notamment sur les supports partagés ou en fin de vie.", action: "Suivez la procédure officielle de votre appareil ou organisation avant de céder ou recycler un support." },
  "data-5": { title: "Choisir un canal adapté aux informations sensibles", why: "Un canal non adapté peut exposer des informations à des personnes non autorisées.", action: "Utilisez l'outil approuvé pour partager les données sensibles et vérifiez les destinataires avant l'envoi." },
  "data-6": { title: "Savoir signaler une fuite de données", why: "Un signalement rapide permet à l'organisation de limiter l'impact et de suivre ses obligations.", action: "Repérez le contact ou la procédure d'incident et signalez immédiatement toute exposition suspectée." },
  "infra-1": { title: "Vérifier la protection des appareils", why: "Une protection active peut détecter certaines menaces, mais doit rester à jour.", action: "Vérifiez que la protection intégrée ou approuvée est activée et que ses mises à jour automatiques fonctionnent." },
  "infra-2": { title: "Installer les mises à jour", why: "Les mises à jour corrigent souvent des failles déjà connues.", action: "Activez les mises à jour automatiques et redémarrez vos appareils lorsqu'ils le demandent." },
  "infra-3": { title: "Sécuriser le travail à distance", why: "Les protections nécessaires dépendent des outils et règles de votre organisation.", action: "Utilisez les outils d'accès à distance approuvés par votre organisation ; évitez les réseaux publics pour les opérations sensibles." },
  "infra-4": { title: "Sécuriser le Wi-Fi", why: "Un Wi-Fi mal configuré peut faciliter l'accès non autorisé au réseau.", action: "Utilisez un chiffrement moderne, un mot de passe unique et un réseau invité séparé si votre équipement le permet." },
  "infra-5": { title: "Vérifier les protections réseau", why: "Les protections réseau varient selon le matériel et doivent être configurées et maintenues correctement.", action: "Demandez à la personne responsable de vérifier que le pare-feu fourni par le système ou le routeur est activé et à jour." },
  "infra-6": { title: "Verrouiller les appareils sans surveillance", why: "Un appareil ouvert peut donner accès aux comptes et aux informations qui y sont connectés.", action: "Activez le verrouillage automatique après une courte période et verrouillez l'écran dès que vous partez." },
  "fin-1": { title: "Renforcer les comptes financiers", why: "Les comptes financiers méritent une protection renforcée et des alertes en cas d'opération.", action: "Activez la 2FA proposée par votre banque et les notifications de transactions." },
  "fin-2": { title: "Détecter les faux conseillers", why: "Un appel affichant le bon numéro peut tout de même être frauduleux.", action: "Raccrochez et rappelez votre banque avec le numéro inscrit sur sa carte ou son site officiel." },
  "fin-4": { title: "Vérifier un nouveau bénéficiaire", why: "Un RIB peut être remplacé dans un échange compromis sans que le message paraisse suspect.", action: "Confirmez tout changement de coordonnées bancaires par un canal indépendant déjà connu." },
  "fin-5": { title: "Repérer rapidement une opération inhabituelle", why: "Une vérification régulière améliore les chances de réagir rapidement à une transaction inconnue.", action: "Activez les alertes disponibles et consultez vos opérations à intervalles réguliers." },
  "fin-6": { title: "Limiter le risque des achats en ligne", why: "Des plafonds et moyens de paiement dédiés peuvent limiter l'impact d'une utilisation frauduleuse.", action: "Activez les contrôles proposés par votre banque et utilisez une carte virtuelle lorsqu'elle est disponible." },
};

/** Calculate the local self-assessment for one learner profile. */
export function calculateResult(input: Answers, profile: ProfileId = "tpe"): QuizResult {
  const answers = completeAnswersSchemaFor(profile).parse(input);
  const questions = getQuestionsForProfile(profile);
  const scoreFor = (id: string) => {
    const q = quizQuestions.find((question) => question.id === id)!;
    return q.options[answers[id]].value;
  };
  const maxScore = questions.length * 3;
  const score = questions.reduce((sum, q) => sum + scoreFor(q.id), 0);
  const percentage = Math.round(score / maxScore * 100);
  const themeScores = themes.flatMap((theme) => {
    const themeQuestions = questions.filter((q) => q.theme === theme);
    if (!themeQuestions.length) return [];
    const total = themeQuestions.reduce((sum, q) => sum + scoreFor(q.id), 0);
    return [{ theme, themeIcon: themeQuestions[0].themeIcon, score: total,
      maxScore: themeQuestions.length * 3, percentage: Math.round(total / (themeQuestions.length * 3) * 100) }];
  });
  const recommendations: LearningStep[] = questions
    .filter((q) => scoreFor(q.id) < 3 && actions[q.id])
    .sort((a, b) => scoreFor(a.id) - scoreFor(b.id))
    .slice(0, 3).map((q) => ({ theme: q.theme, ...actions[q.id] }));
  if (!recommendations.length) recommendations.push({
    theme: "Vos bonnes pratiques",
    title: "Entretenir vos acquis",
    why: "Les risques et les outils évoluent au fil du temps.",
    action: "Gardez vos appareils à jour et refaites ce bilan dans quelques mois.",
  });
  const level = percentage >= 85 ? "excellent" : percentage >= 70 ? "bon" : percentage >= 50 ? "moyen" : percentage >= 30 ? "faible" : "critique";
  return { score, maxScore, percentage, level, themeScores, recommendations };
}
