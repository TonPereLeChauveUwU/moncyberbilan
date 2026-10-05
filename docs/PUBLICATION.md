# Avant publication

## Coordonnées et confidentialité
- Contact fourni par l'éditeur : contact.moncyberbilan@protonmail.com. Vérifier sa réception avant publication.
- Compléter `client/src/config/publisher.ts` avec l'identité légale, l'adresse publique et les mentions applicables. CyberBilan est le nom du projet.
- Finaliser les informations de confidentialité relatives à l'hébergement et aux messages reçus par contact, notamment les durées de conservation effectives. Le texte actuel décrit le fonctionnement ; il ne constitue pas une validation de conformité.

## Fonctionnement sans envoi de bilan
- Aucun formulaire de collecte d'email, aucune transmission des réponses, aucun rapport envoyé automatiquement.
- Aucun compte SendGrid, Redis ou secret serveur nécessaire. Les anciens réglages cloud éventuels ne sont pas utilisés et n'ont pas été modifiés.
- L'API historique de contacts est supprimée. Les éventuelles données historiques restent à gérer séparément ; aucune base n'a été effacée.

## Vérifications sur l'environnement publié
- Vérifier le parcours complet et le lien mailto vers l'adresse finale.
- Confirmer que `/api/leads` est introuvable et que le quiz n'émet aucune requête de collecte.
- Vérifier les en-têtes HTTP et mesurer Lighthouse/Core Web Vitals quand la version sera publiée.
