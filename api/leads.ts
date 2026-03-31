// Vercel Serverless Function — /api/leads
// Capture email + envoie le rapport par email via SendGrid

interface ThemeScore {
  theme: string;
  themeIcon: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface LeadBody {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  score: number;
  level: string;
  percentage: number;
  answers: string;
  themeScores?: ThemeScore[];
  recommendations?: string[];
  createdAt?: string;
}

function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    critique: "🔴 Critique",
    faible: "🟠 Faible",
    moyen: "🟡 Moyen",
    bon: "🟢 Bon",
    excellent: "✅ Excellent",
  };
  return map[level] || level;
}

function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    critique: "#ef4444",
    faible: "#f97316",
    moyen: "#eab308",
    bon: "#22c55e",
    excellent: "#00a5ad",
  };
  return map[level] || "#00a5ad";
}

function getThemeBarColor(pct: number): string {
  if (pct >= 70) return "#22c55e";
  if (pct >= 50) return "#eab308";
  if (pct >= 30) return "#f97316";
  return "#ef4444";
}

function buildEmailHtml(data: LeadBody): string {
  const levelLabel = getLevelLabel(data.level);
  const levelColor = getLevelColor(data.level);

  const themeRows = (data.themeScores || [])
    .map(
      (ts) => `
      <tr>
        <td style="padding:10px 12px;font-size:14px;color:#e0e0e0;">
          ${ts.themeIcon} ${ts.theme}
        </td>
        <td style="padding:10px 12px;text-align:center;">
          <div style="background:#1a2332;border-radius:8px;overflow:hidden;height:8px;width:120px;display:inline-block;">
            <div style="background:${getThemeBarColor(ts.percentage)};height:100%;width:${ts.percentage}%;border-radius:8px;"></div>
          </div>
        </td>
        <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:600;color:${getThemeBarColor(ts.percentage)};">
          ${ts.percentage}%
        </td>
      </tr>`
    )
    .join("");

  const recommendationsList = (data.recommendations || [])
    .map((r) => `<li style="padding:4px 0;color:#b0b8c4;font-size:13px;">→ ${r}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0f1419;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1419;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:24px 0;text-align:center;">
          <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
            🔐 MonCyberBilan<span style="color:#00a5ad;">.app</span>
          </div>
          <div style="font-size:12px;color:#6b7280;margin-top:4px;">Votre rapport de cybersécurité personnalisé</div>
        </td></tr>

        <!-- Score Card -->
        <tr><td style="padding:0 0 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0d2137,#0a1929);border:1px solid ${levelColor}40;border-radius:12px;overflow:hidden;">
            <tr><td style="padding:32px;text-align:center;">
              <div style="font-size:48px;font-weight:800;color:${levelColor};line-height:1;">${data.percentage}%</div>
              <div style="font-size:16px;font-weight:600;color:${levelColor};margin-top:8px;">Niveau : ${levelLabel}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:6px;">${data.score} / 90 points</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Theme Breakdown -->
        <tr><td style="padding:0 0 20px;">
          <div style="font-size:15px;font-weight:600;color:#ffffff;margin-bottom:12px;">Détail par thème</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111820;border:1px solid #1e2a3a;border-radius:10px;overflow:hidden;">
            ${themeRows}
          </table>
        </td></tr>

        <!-- Recommendations -->
        ${recommendationsList ? `
        <tr><td style="padding:0 0 20px;">
          <div style="font-size:15px;font-weight:600;color:#ffffff;margin-bottom:12px;">Recommandations</div>
          <div style="background:#111820;border:1px solid #1e2a3a;border-radius:10px;padding:16px 20px;">
            <ul style="margin:0;padding:0;list-style:none;">
              ${recommendationsList}
            </ul>
          </div>
        </td></tr>
        ` : ""}

        <!-- CTA -->
        <tr><td style="padding:16px 0 8px;text-align:center;">
          <div style="font-size:14px;color:#b0b8c4;margin-bottom:16px;">
            Envie de corriger vos failles ? Notre formation certifiée couvre chaque thème en profondeur.
          </div>
          <a href="https://moncyberbilan.app" style="display:inline-block;background:#00a5ad;color:#ffffff;font-weight:600;font-size:14px;padding:12px 32px;border-radius:8px;text-decoration:none;">
            Découvrir la formation
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 16px;text-align:center;border-top:1px solid #1e2a3a;margin-top:24px;">
          <div style="font-size:11px;color:#4b5563;">
            MonCyberBilan.app — Évaluez et améliorez votre cybersécurité<br>
            <a href="https://moncyberbilan.app" style="color:#00a5ad;text-decoration:none;">moncyberbilan.app</a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendReportEmail(data: LeadBody): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn("[WARN] SENDGRID_API_KEY not set, skipping email");
    return false;
  }

  const senderEmail = process.env.SENDGRID_SENDER_EMAIL || "noreply@moncyberbilan.app";
  const senderName = process.env.SENDGRID_SENDER_NAME || "MonCyberBilan";

  const emailPayload = {
    personalizations: [
      {
        to: [{ email: data.email }],
        subject: `Votre score cybersécurité : ${data.percentage}% — ${getLevelLabel(data.level)}`,
      },
    ],
    from: { email: senderEmail, name: senderName },
    reply_to: { email: senderEmail, name: senderName },
    content: [
      {
        type: "text/html",
        value: buildEmailHtml(data),
      },
    ],
    tracking_settings: {
      click_tracking: { enable: true },
      open_tracking: { enable: true },
    },
  };

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (res.status === 202 || res.status === 200) {
      console.log(`[EMAIL] Rapport envoyé à ${data.email}`);
      return true;
    } else {
      const errorText = await res.text();
      console.error(`[EMAIL ERROR] ${res.status}: ${errorText}`);
      return false;
    }
  } catch (err: any) {
    console.error(`[EMAIL ERROR] ${err.message}`);
    return false;
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const body: LeadBody = req.body;

      if (!body.email || body.score === undefined || !body.level) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      console.log(`[LEAD] ${body.email} — Score: ${body.score} (${body.percentage}%) — Level: ${body.level}`);

      // Send email report asynchronously (don't block response)
      const emailSent = await sendReportEmail(body);

      return res.status(201).json({
        success: true,
        email: body.email,
        emailSent,
      });
    } catch (err: any) {
      console.error(`[ERROR] ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
