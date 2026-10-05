import { Link } from "wouter";
import { publisher } from "@/config/publisher";

export default function Information({ kind }: { kind: "privacy" | "legal" | "contact" }) {
  const title = kind === "privacy" ? "Confidentialité" : kind === "legal" ? "Mentions légales" : "Contact";
  return <main className="information-page max-w-2xl mx-auto space-y-6">
    <Link href="/" className="text-primary underline">Retour à l'accueil</Link>
    <h1 className="text-2xl font-bold">{title}</h1>
    {kind === "privacy" ? <div className="space-y-5 text-sm leading-relaxed">
      <section><h2 className="font-semibold mb-2">Votre questionnaire</h2>
        <p>Vous pouvez consulter votre bilan sans donner votre email. Les réponses restent dans cet onglet du navigateur. Elles permettent de reprendre le questionnaire après un rechargement, pendant 24 heures maximum. Le bouton « Effacer et recommencer » les remplace par un questionnaire vide.</p></section>
      <section><h2 className="font-semibold mb-2">Aucune collecte pour le bilan</h2>
        <p>Le calcul du bilan se fait dans votre navigateur. Le questionnaire ne transmet ni vos réponses ni votre score au serveur et ne demande aucune adresse email. Il n'existe pas d'envoi automatique de rapport ni d'inscription commerciale.</p></section>
      <section><h2 className="font-semibold mb-2">Nous contacter</h2>
        <p>Le lien de contact ouvre votre application de messagerie. Si vous nous écrivez, votre adresse et le contenu de votre message sont utilisés pour traiter votre demande. Évitez d'envoyer des mots de passe ou des informations sensibles.</p>
        <a className="text-primary underline" href={`mailto:${publisher.contactEmail}`}>{publisher.contactEmail}</a></section>
      <section><h2 className="font-semibold mb-2">Hébergement</h2>
        <p>Vercel héberge le site et peut traiter des données techniques de connexion, notamment l'adresse IP, dans ses journaux de fonctionnement. Les informations relatives à l'éditeur et aux durées de conservation applicables restent à compléter.</p></section>
    </div> : kind === "legal" ? <div className="space-y-4 text-sm leading-relaxed">
      <p>Nom du projet : {publisher.brand}.</p>
      {publisher.legalName && <p>Éditeur : {publisher.legalName}.</p>}
      {publisher.publicAddress ? <p>Adresse : {publisher.publicAddress}.</p> : <p>Ville : {publisher.city}. Adresse postale complète à préciser.</p>}
      {publisher.registration && <p>Immatriculation : {publisher.registration}.</p>}
      {!publisher.legalName && <p>Les informations d'identification de l'éditeur sont en cours de finalisation.</p>}
      <p>Le site est hébergé par Vercel. Le bilan est une auto-évaluation déclarative : il ne constitue ni un audit technique ni une certification.</p>
      <Link href="/contact" className="text-primary underline">Contact</Link>
    </div> : <div className="text-sm leading-relaxed">
      {publisher.contactEmail ? <a className="text-primary underline" href={`mailto:${publisher.contactEmail}`}>{publisher.contactEmail}</a>
        : <p>L'adresse de contact de CyberBilan sera publiée dès son ouverture.</p>}
    </div>}
  </main>;
}

