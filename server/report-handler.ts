import type { Request, Response } from "express";
import { reportRequestSchema, calculateResult } from "../shared/quiz";
import { checkRateLimit, type RateLimitResult } from "./report-rate-limit";
import { sendReportEmail } from "./report-email";
import type { QuizResult } from "../shared/schema";

type Dependencies = {
  configured: () => boolean;
  limit: (ip: string, email: string) => Promise<RateLimitResult>;
  send: (data: QuizResult & { email: string }) => Promise<boolean>;
};

export function createReportHandler(deps: Dependencies) {
  return async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Méthode non autorisée." });
    }
    const origin = req.headers.origin;
    const allowedOrigins = ["https://moncyberbilan.app", "https://www.moncyberbilan.app"];
    if (process.env.VERCEL_URL) allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
    if (process.env.NODE_ENV !== "production") allowedOrigins.push("http://localhost:5000", "http://127.0.0.1:5000");
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: "Origine non autorisée." });
    }
    if (!req.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
      return res.status(415).json({ error: "Le contenu doit être au format JSON." });
    }
    if (Buffer.byteLength(JSON.stringify(req.body) ?? "") > 16_384) {
      return res.status(413).json({ error: "Requête trop volumineuse." });
    }
    const parsed = reportRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Vérifiez votre adresse email et complétez le questionnaire." });
    }
    if (!deps.configured()) {
      return res.status(503).json({ error: "L'envoi des rapports est temporairement indisponible. Votre bilan reste consultable ici." });
    }
    try {
      // Vercel sets this header; outside Vercel use Express's untrusted-proxy-safe IP.
      const vercelIp = req.headers["x-vercel-forwarded-for"];
      const ip = process.env.VERCEL && typeof vercelIp === "string"
        ? vercelIp.split(",")[0].trim() : req.ip || req.socket?.remoteAddress || "unknown";
      const limit = await deps.limit(ip, parsed.data.email);
      if (!limit.allowed) {
        res.setHeader("Retry-After", String(limit.retryAfter));
        return res.status(429).json({ error: "Trop de demandes. Réessayez plus tard ; votre bilan reste disponible à l'écran." });
      }
      const result = calculateResult(parsed.data.answers);
      const sent = await deps.send({ ...result, email: parsed.data.email });
      if (!sent) return res.status(502).json({ error: "Le service d'envoi n'a pas accepté le rapport. Réessayez plus tard." });
      // Accepted by the provider is not a guarantee of inbox delivery.
      return res.status(202).json({ success: true, emailSent: true });
    } catch {
      // Do not log submitted addresses, answers, provider payloads or secrets.
      console.error("Report service unavailable");
      return res.status(503).json({ error: "L'envoi des rapports est temporairement indisponible. Réessayez plus tard." });
    }
  };
}

export default createReportHandler({
  configured: () => Boolean(process.env.SENDGRID_API_KEY && process.env.SENDGRID_SENDER_EMAIL &&
    process.env.RATE_LIMIT_REDIS_URL && process.env.RATE_LIMIT_REDIS_TOKEN),
  limit: checkRateLimit,
  send: sendReportEmail,
});
