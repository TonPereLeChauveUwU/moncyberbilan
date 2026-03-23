import { Link } from "wouter";
import { Shield, ChevronRight, Lock, Brain, Database, Wifi, Banknote, Award, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const themes = [
  { icon: Lock, title: "Mots de passe", desc: "Authentification & gestion des accès" },
  { icon: Brain, title: "Phishing", desc: "Ingénierie sociale & arnaques" },
  { icon: Database, title: "Données & RGPD", desc: "Protection & conformité" },
  { icon: Wifi, title: "Postes & Réseaux", desc: "Infrastructure & sécurité réseau" },
  { icon: Banknote, title: "Finance", desc: "Sécurité des comptes & transactions" },
];

const stats = [
  { value: "6,2 Mds€", label: "Marché cyber FR d'ici 2028" },
  { value: "49%", label: "Hausse des offres d'emploi cyber" },
  { value: "36%", label: "Maturité cyber du secteur public" },
  { value: "30", label: "Questions d'évaluation" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="MonCyberBilan logo">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <path d="M16 8 L16 14 M12 11 L16 14 L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <rect x="10" y="15" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <circle cx="16" cy="19.5" r="1.5" fill="currentColor" className="text-primary" />
              <path d="M16 21 L16 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
            </svg>
            <span className="font-semibold text-sm tracking-tight">MonCyberBilan</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <span className="cursor-default">Score</span>
            <span className="cursor-default">Formation</span>
            <span className="cursor-default">Certification</span>
          </nav>
          <Link href="/quiz">
            <Button size="sm" className="gap-1.5 text-sm" data-testid="button-start-quiz-header">
              Évaluer mon score
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6" data-testid="badge-free">
            <Shield className="w-3.5 h-3.5" />
            Évaluation gratuite en 5 minutes
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight mb-4 text-foreground">
            Quel est votre score de cybersécurité ?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
            30 questions, 5 thèmes, un diagnostic personnalisé de vos pratiques de sécurité numérique. Identifiez vos failles et corrigez-les avant qu'il ne soit trop tard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz">
              <Button size="lg" className="gap-2 px-6 text-sm font-medium w-full sm:w-auto" data-testid="button-start-quiz-hero">
                Commencer le diagnostic
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 px-6 text-sm font-medium" disabled data-testid="button-formation">
              <Award className="w-4 h-4" />
              Voir la formation
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-card/50 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 themes */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-center mb-2">5 thèmes évalués</h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Chaque thème contient 6 questions couvrant les pratiques essentielles de cybersécurité.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {themes.map((t) => (
              <Card key={t.title} className="group border border-border/60 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                    <t.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 bg-card/30 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-center mb-8">Comment ça marche</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Répondez au quiz", desc: "30 questions sur vos pratiques de cybersécurité professionnelle. 5 minutes." },
              { step: "02", title: "Obtenez votre score", desc: "Un score global + détail par thème avec des recommandations personnalisées." },
              { step: "03", title: "Corrigez vos failles", desc: "Suivez la formation certifiée pour atteindre le niveau excellent." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target audiences */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-center mb-8">Pour qui ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "Salariés & Freelances", price: "Gratuit → 49€", desc: "Évaluez vos pratiques et montez en compétence avec la formation essentielle." },
              { icon: Shield, title: "PME & Managers", price: "149€ / personne", desc: "Formation pro avec badge numérique LinkedIn pour vos équipes." },
              { icon: Award, title: "Entreprises (10+)", price: "990€ / pack", desc: "Pack entreprise avec dashboard de suivi et rapport de conformité." },
            ].map((item) => (
              <Card key={item.title} className="border border-border/60 bg-card">
                <CardContent className="p-5">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                  <div className="text-xs text-primary font-medium mb-2">{item.price}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-primary/5 border-t border-border/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-lg font-bold mb-3">Prêt à évaluer votre cybersécurité ?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Le diagnostic est gratuit, anonyme et prend 5 minutes. Vos résultats restent confidentiels.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="gap-2 px-8 text-sm font-medium" data-testid="button-start-quiz-cta">
              Lancer le diagnostic
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-label="MonCyberBilan">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <path d="M16 8 L16 14 M12 11 L16 14 L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <rect x="10" y="15" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary" />
            </svg>
            <span>MonCyberBilan.app &copy; 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mentions légales</span>
            <span>Politique de confidentialité</span>
            <span>Contact</span>
          </div>
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
