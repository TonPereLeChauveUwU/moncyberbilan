import type { Answers } from "@shared/quiz";

export async function sendReport(email: string, answers: Answers): Promise<void> {
  const response = await fetch("/api/leads", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, answers }), signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success !== true || body?.emailSent !== true) {
    const messages: Record<number, string> = {
      400: "Vérifiez votre adresse email et complétez le questionnaire.",
      429: "Trop de demandes. Réessayez plus tard.",
      503: "L'envoi des rapports est temporairement indisponible. Votre bilan reste consultable ici.",
    };
    throw new Error(messages[response.status] || "L'envoi n'a pas pu être confirmé. Réessayez plus tard.");
  }
}
