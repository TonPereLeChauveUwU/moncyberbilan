import { Link } from "wouter";
import { publisher } from "@/config/publisher";

export default function Information({ kind }: { kind: "privacy" | "legal" | "contact" }) {
  const title = kind === "privacy" ? "Confidentialité" : kind === "legal" ? "Mentions légales" : "Contact";
  return <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
    <Link href="/" className="text-primary underline">Retour à l'accueil</Link>
    <h1 className="text-2xl font-bold">{title}</h1>
    {kind === "privacy" ? <div className="space-y-5 text-sm leading-relaxed">
      <section><h2 className="font-semibold mb-2">Votre questionnaire</h2>
        <p>Vous pouvez consulter votre bilan sans donner votre email. Les réponses restent dans cet onglet du navigateur. Elles permettent de reprendre le questionnaire après un rechargement, pendant 24 heures maximum. Le bouton « Effacer et recommencer » les remplace par un questionnaire vide.</p></section>
      <section><h2 className="font-semibold mb-2">Recevoir le rapport par email</h2>
        <p>Si vous demandez un rapport, votre adresse et vos réponses sont envoyées au serveur hébergé chez Vercel pour calculer votre bilan. L'adresse et le rapport sont transmis à SendGrid pour l'envoi. Les réponses ne sont pas enregistrées dans une base de contacts par cette application. Aucun abonnement commercial n'est créé et le suivi des ouvertures et des clics est désactivé.</p></section>
      <section><h2 className="font-semibold mb-2">Protection contre les abus</h2>
        <p>Des compteurs temporaires associés à des empreintes de l'adresse email et de l'adresse IP limitent les envois. Ces compteurs expirent au plus tard après 24 heures. Ils ne contiennent ni votre adresse en clair ni vos réponses.</p></section>
      <section><h2 className="font-semibold mb-2">Prestataires et droits</h2>
        <p>Les prestataires peuvent conserver des journaux techniques nécessaires au fonctionnement du service. Leurs durées de conservation et les informations sur le responsable du traitement doivent être finalisées avant l'ouverture du service d'envoi.</p>
        <Link href="/contact" className="text-primary underline">Contacter l'éditeur</Link></section>
    </div> : kind === "legal" ? <div className="space-y-4 text-sm leading-relaxed">
      <p>Nom du projet : {publisher.brand}.</p>
      {publisher.legalName && <p>Éditeur : {publisher.legalName}.</p>}
      {publisher.publicAddress && <p>Adresse : {publisher.publicAddress}.</p>}
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
