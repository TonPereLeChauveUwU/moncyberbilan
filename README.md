# MonCyberBilan.app 🔐

> **Évaluez votre score de cybersécurité en 5 minutes.**

Plateforme EdTech qui évalue le score de cybersécurité professionnel d'un utilisateur, identifie ses failles et propose une formation certifiée pour les corriger.

## 🎯 Concept

```
Score gratuit → Formation payante → Certification LinkedIn
```

Le score est gratuit. La formation est le produit payant. La certification est la raison d'acheter.

## Développement et validation

Node.js 24 est utilisé en local, en CI et sur Vercel.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm start
```

Le quiz et les résultats fonctionnent sans configuration de services externes.
L'envoi des rapports exige les variables serveur de `.env.example` : SendGrid et
un Redis REST compatible Upstash pour les quotas. Les configurer dans le processus
serveur (ou dans Vercel) ; les fichiers `.env` ne sont pas chargés automatiquement
par Express. Ne jamais mettre un secret dans une variable `VITE_`.

Le serveur Express et la fonction Vercel réutilisent `server/report-handler.ts`.
Seuls l'email et les indices des réponses sont acceptés ; le score est recalculé
côté serveur. L'ancienne lecture publique des contacts est désactivée. Le stockage
SQLite historique n'est plus utilisé par le parcours d'envoi. Aucun fichier de base
de données existant n'est supprimé par cette modification.

**Publication :** les coordonnées de l'éditeur et la notice de confidentialité
restent à finaliser. Voir [la liste de préparation](docs/PUBLICATION.md) avant fusion
et mise en production. Les tests remplacent les services externes ; ils n'envoient
aucun email réel. Le bilan est une auto-évaluation, sans certification.

## ⚡ Stack technique

| Composant | Technologie |
|-----------|------------|
| Frontend | React + Vite + Tailwind CSS + shadcn/ui |
| Backend | Fonction Vercel / Express, traitement commun |
| Hébergement | Vercel / DigitalOcean (GitHub Student Pack) |
| CI/CD | GitHub Actions |
| Emailing | SendGrid (GitHub Student Pack) |
| Anti-abus | Redis REST, quotas atomiques et empreintes HMAC |
| Tests | Node test runner, TypeScript |

## 📊 Fonctionnalités MVP

- ✅ Landing page avec proposition de valeur
- ✅ Questionnaire de 30 questions (5 thèmes × 6 questions)
- ✅ Système de scoring avec résultats personnalisés par thème
- ✅ Capture d'emails (lead generation)
- ✅ Envoi optionnel du rapport par email, sans liste de prospection
- ✅ Dark theme cybersécurité
- ✅ Responsive design

## 🔒 5 thèmes évalués

1. **Mots de passe & Authentification** — Gestion des accès, 2FA, gestionnaires
2. **Phishing & Ingénierie sociale** — Détection d'arnaques, bonnes pratiques
3. **Protection des données & RGPD** — Chiffrement, sauvegardes, conformité
4. **Sécurité des postes & réseaux** — Antivirus, VPN, pare-feu, mises à jour
5. **Cybersécurité & Finance** — Sécurité bancaire, crypto, arnaques financières

