# MonCyberBilan.app 🔐

> **Évaluez votre score de cybersécurité en 5 minutes.**

Plateforme EdTech qui évalue le score de cybersécurité professionnel d'un utilisateur, identifie ses failles et propose une formation certifiée pour les corriger.

## 🎯 Concept

```
Score gratuit → Formation payante → Certification LinkedIn
```

Le score est l'appât gratuit. La formation est le produit payant. La certification est la raison d'acheter.

## ⚡ Stack technique

| Composant | Technologie |
|-----------|------------|
| Frontend | React + Vite + Tailwind CSS + shadcn/ui |
| Backend | Express.js + SQLite (Drizzle ORM) |
| Hébergement | Vercel / DigitalOcean (GitHub Student Pack) |
| CI/CD | GitHub Actions |
| Emailing | SendGrid (GitHub Student Pack) |
| Paiement | Stripe |
| Analytics | PostHog / Google Analytics |
| Badges | Credly |

## 📊 Fonctionnalités MVP

- ✅ Landing page avec proposition de valeur
- ✅ Questionnaire de 30 questions (5 thèmes × 6 questions)
- ✅ Système de scoring avec résultats personnalisés par thème
- ✅ Capture d'emails (lead generation)
- ✅ Backend API pour stockage des leads
- ✅ Dark theme cybersécurité
- ✅ Responsive design

## 🔒 5 thèmes évalués

1. **Mots de passe & Authentification** — Gestion des accès, 2FA, gestionnaires
2. **Phishing & Ingénierie sociale** — Détection d'arnaques, bonnes pratiques
3. **Protection des données & RGPD** — Chiffrement, sauvegardes, conformité
4. **Sécurité des postes & réseaux** — Antivirus, VPN, pare-feu, mises à jour
5. **Cybersécurité & Finance** — Sécurité bancaire, crypto, arnaques financières

## 🚀 Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/TonPereLeChauveUwU/moncyberbilan.git
cd moncyberbilan

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Le serveur démarre sur `http://localhost:5000`.

## 📈 Roadmap

- [ ] Intégration Stripe pour les paiements
- [ ] Séquence email post-quiz (SendGrid)
- [ ] Modules de formation vidéo
- [ ] Badge Credly automatisé
- [ ] Blog SEO intégré
- [ ] Pack entreprise (dashboard multi-utilisateurs)
- [ ] Certification Qualiopi / CPF

## 📄 Licence

MIT

---

*Projet développé dans le cadre d'une startup EdTech en cybersécurité.*
