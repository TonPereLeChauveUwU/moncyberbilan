# Avant publication

Cette branche reste une proposition à valider. Ne pas fusionner en production avant les points ci-dessous.

## Coordonnées et confidentialité
- Le nom de projet confirmé est CyberBilan. Il ne remplace pas l'identité légale de l'éditeur.
- Compléter `client/src/config/publisher.ts` avec l'identité, l'adresse publique, les mentions applicables et une adresse email créée et contrôlée. L'adresse Gmail envisagée par l'utilisateur n'est pas publiée.
- Finaliser les pages légales et la notice de confidentialité : responsable du traitement, base légale, droits, durées effectives des journaux Vercel/SendGrid/Redis, transferts et coordonnées. Le texte actuel décrit le fonctionnement technique, ce n'est pas une validation de conformité.
- L'email sert uniquement à envoyer le rapport. Aucune liste de prospection n'est créée.

## Email et protection contre les abus
- Renseigner côté serveur les variables de `.env.example`, avec un expéditeur vérifié par SendGrid.
- Prévoir un Redis REST compatible Upstash. Les compteurs Lua sont atomiques : 5 demandes par IP/heure, 3 par adresse/jour, plafond global de 100/jour. Les empreintes HMAC expirent avec les compteurs, après au plus 24 h. Les tentatives échouées comptent dans les limites pour éviter un contournement.
- Si le limiteur, SendGrid ou leur configuration est absent, l'API refuse l'envoi ; le diagnostic reste accessible. Pas de repli vers un compteur mémoire inefficace en serverless.
- Garder les secrets hors des variables `VITE_`. Utiliser des identifiants distincts en prévisualisation et en production. Aucun service payant ou ressource cloud n'a été créé par ces changements.
- Ajuster la région de la fonction à celle des services après vérification du besoin et des engagements de conservation/transfert.
- Le serveur local et Vercel utilisent le même traitement. L'ancienne API publique de consultation des leads est désactivée. L'ancien module SQLite reste inutilisé ; toute éventuelle base historique doit être gérée séparément, sans suppression automatique.

## Vérifications restantes sur l'environnement réel
- Valider la notice complète et les coordonnées avant publication.
- Configurer les secrets et confirmer un envoi sur une adresse de test contrôlée par l'éditeur ; vérifier le retour d'erreur SendGrid et un 429.
- Confirmer les logs sans données personnelles et les en-têtes HTTP après déploiement.
- Mesurer Lighthouse et les Core Web Vitals sur la version publiée, avec des données terrain quand disponibles.
- Aucun email réel n'est envoyé par les tests automatisés.

Référence limiteur : https://upstash.com/docs/redis/features/restapi
