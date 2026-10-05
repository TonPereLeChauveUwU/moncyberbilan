import { Link } from "wouter";
import { ArrowUpRight, ArrowRight, ShieldCheck, LockKeyhole, Fingerprint, Database, Monitor, Landmark, Check, Clock3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const themes = [
  { icon: Fingerprint, title: "Vos accès", desc: "Mots de passe et authentification", detail: "Les bons réflexes pour garder le contrôle de vos comptes." },
  { icon: ShieldCheck, title: "Les arnaques", desc: "Phishing et ingénierie sociale", detail: "Reconnaître les pièges avant de cliquer ou de répondre." },
  { icon: Database, title: "Vos données", desc: "Protection et confidentialité", detail: "Sauvegarder, partager et protéger ce qui compte." },
  { icon: Monitor, title: "Vos appareils", desc: "Postes et réseaux", detail: "Faire le point sur la sécurité de votre environnement." },
  { icon: Landmark, title: "Vos finances", desc: "Comptes et transactions", detail: "Sécuriser vos paiements et repérer les demandes suspectes." },
];

export default function Home() {
  return <div className="home-page">
    <a href="#contenu" className="skip-link">Aller au contenu</a>
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand"><span className="brand-icon"><ShieldCheck aria-hidden="true" /></span><span>mon<span className="text-primary">cyber</span>bilan<span className="brand-dot">.</span></span></Link>
        <nav aria-label="Navigation principale" className="desktop-nav"><a href="#methode">La méthode</a><Link href="/confidentialite">Confidentialité</Link><Link href="/contact">Contact</Link></nav>
        <Button asChild className="header-cta" data-testid="button-start-quiz-header"><Link href="/quiz">Faire le bilan <ArrowUpRight /></Link></Button>
      </div>
    </header>
    <main id="contenu">
      <section className="site-container hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> VOTRE SÉCURITÉ NUMÉRIQUE, EN CLAIR</p>
          <h1>Les bons réflexes.<br />Les bons déclics.<br /><span className="text-primary">Votre cyberbilan.</span></h1>
          <p className="hero-description">Faites le point sur vos habitudes numériques. Découvrez vos points forts et les actions qui feront la différence.</p>
          <Button asChild size="lg" className="hero-cta" data-testid="button-start-quiz-hero"><Link href="/quiz">Commencer mon bilan <ArrowUpRight /></Link></Button>
          <div className="hero-reassurance"><span><Clock3 /> Environ 5 minutes</span><span><Check /> Gratuit, sans compte</span></div>
        </div>
        <div className="preview-scene">
          <div className="preview-orbit" aria-hidden="true" />
          <div className="report-preview">
            <div className="preview-heading"><span><span className="status-dot" /> VOTRE VUE D’ENSEMBLE</span><span className="sample-label">Exemple de bilan</span></div>
            <div className="preview-score"><div className="score-orbit"><div><strong>72<span>%</span></strong><small>Score illustratif</small></div></div><div><span className="level-pill">De bonnes bases</span><h2>Comprendre.<br />Puis progresser.</h2><p>Un score. Cinq thèmes.<br />Des conseils concrets.</p></div></div>
            <div className="preview-bars" aria-label="Exemples de scores par thème">
              {([['Accès & mots de passe', 83], ['Protection des données', 67], ['Sécurité des appareils', 72]] as const).map(([label, value]) => <div key={label}><div><span>{label}</span><span>{value}%</span></div><div className="preview-track"><span style={{ width: `${value}%` }} /></div></div>)}
            </div>
            <div className="preview-action"><span className="mini-icon"><LockKeyhole /></span><div><strong>Votre prochaine action</strong><p>Activer la double authentification</p></div><ArrowUpRight aria-hidden="true" /></div>
          </div>
          <div className="privacy-note"><ShieldCheck /><span>Vos réponses restent<br /><strong>dans votre navigateur.</strong></span></div>
        </div>
      </section>
      <div className="site-container fact-strip"><div><strong>30</strong><span>questions concrètes</span></div><div><strong>5</strong><span>thèmes essentiels</span></div><div><strong>0</strong><span>email à donner</span></div><a href="#methode">Découvrez la méthode <ChevronDown /></a></div>
      <section id="methode" className="site-container content-section">
        <div className="section-heading"><div><p className="eyebrow">01 / LE DIAGNOSTIC</p><h2>Votre quotidien numérique.<br /><span className="muted-title">Sous tous les angles.</span></h2></div><p>Pas besoin d’être expert. Répondez selon vos habitudes : le bilan vous aide à identifier vos priorités.</p></div>
        <div className="theme-grid">{themes.map((theme, i) => <article className="theme-tile" key={theme.title}><div className="tile-top"><theme.icon aria-hidden="true" /><span>0{i + 1}</span></div><h3>{theme.title}</h3><p className="theme-subtitle">{theme.desc}</p><p>{theme.detail}</p><span className="question-count">6 questions</span></article>)}</div>
      </section>
      <section className="method-section"><div className="site-container content-section"><div className="section-heading"><div><p className="eyebrow">02 / LA SUITE</p><h2>Du constat à l’action.<br /><span className="muted-title">En trois étapes.</span></h2></div><p>Un moment pour faire le point.<br />Des habitudes à garder longtemps.</p></div><div className="steps-grid">{[
        ['01','Observez vos habitudes','Répondez aux 30 questions à votre rythme. Vous pouvez revenir sur chaque réponse.'],
        ['02','Découvrez votre profil','Un score global et un détail par thème pour repérer vos points forts et vos axes de progrès.'],
        ['03','Passez à l’action','Commencez par les recommandations de votre bilan, à votre rythme.'],
      ].map(([number,title,description]) => <article key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
      <section className="site-container content-section"><div className="closing-panel"><div><p className="eyebrow">LE PREMIER PAS EST SIMPLE</p><h2>Reprenez la main sur<br />votre sécurité numérique.</h2><p>Gratuit. Sans compte. Sans adresse email à fournir.</p></div><Button asChild size="lg" className="hero-cta" data-testid="button-start-quiz-cta"><Link href="/quiz">C’est parti <ArrowRight /></Link></Button><ShieldCheck className="closing-symbol" aria-hidden="true" /></div><p className="assessment-note">Une auto-évaluation de vos pratiques, pas un audit technique ni une certification. La formation est en préparation.</p></section>
    </main>
    <footer className="site-container site-footer"><div><Link href="/" className="footer-brand">moncyberbilan.</Link><p>Les bons réflexes commencent ici.</p><small>© {new Date().getFullYear()} CyberBilan</small></div><nav aria-label="Informations"><Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/contact">Contact</Link></nav><PerplexityAttribution /></footer>
  </div>;
}
