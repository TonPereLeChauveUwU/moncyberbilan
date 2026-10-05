# CyberBilan

Auto-évaluation gratuite de pratiques de cybersécurité : 30 questions, 5 thèmes,
score et recommandations affichés directement dans le navigateur. Ce bilan ne
constitue ni un audit technique ni une certification. La formation est en préparation.

## Fonctionnement

Aucun compte, aucune collecte d'adresse email, aucun envoi automatique de bilan.
Les réponses et résultats restent dans l'onglet (sessionStorage, 24 heures maximum).
Le contact ouvre la messagerie de l'utilisateur : contact.moncyberbilan@protonmail.com.
Aucune configuration SendGrid ou Redis ni aucun secret n'est nécessaire au quiz.
L'ancienne API de contacts est supprimée. Les modules et données SQLite historiques
restent inutilisés ; aucune base existante n'a été effacée.

## Développement

Node.js 24, React, Vite, Tailwind et shadcn/ui. Vercel sert la version statique ;
Express permet aussi le développement et l'hébergement local.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm start
```

La CI vérifie les types, les tests et la compilation. Les tests couvrent le calcul,
la validation des réponses et la reprise de session.

## Publication

Voir [la liste de préparation](docs/PUBLICATION.md). L'adresse de contact est
renseignée ; l'identité légale et les autres mentions applicables restent à compléter.
