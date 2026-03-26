// Vercel Serverless Function — /api/leads
// Stockage en mémoire pour le MVP (reset au cold start)
// À remplacer par Supabase/Turso/PlanetScale en production

const leads: any[] = [];
let nextId = 1;

export default function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { email, name, company, role, score, level, answers, createdAt } = req.body;

      if (!email || score === undefined || !level || !answers) {
        return res.status(400).json({ error: "Champs requis manquants" });
      }

      const lead = {
        id: nextId++,
        email,
        name: name || null,
        company: company || null,
        role: role || null,
        score,
        level,
        answers,
        createdAt: createdAt || new Date().toISOString(),
      };

      leads.push(lead);
      console.log(`[LEAD] ${email} — Score: ${score} — Level: ${level}`);

      return res.status(201).json(lead);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(leads);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
