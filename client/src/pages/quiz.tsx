import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { quizQuestions, themes } from "@shared/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { calculateResult, type Answers } from "@shared/quiz";
import { loadQuizSession, saveQuizSession, emptySession } from "@/lib/quiz-session";

const levelConfig = {
  critique: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", label: "Critique", emoji: "🔴" },
  faible: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "Faible", emoji: "🟠" },
  moyen: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Moyen", emoji: "🟡" },
  bon: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", label: "Bon", emoji: "🟢" },
  excellent: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", label: "Excellent", emoji: "✅" },
};

export default function Quiz() {
  const [initial] = useState(() => {
    try { return loadQuizSession(sessionStorage); } catch { return emptySession(); }
  });
  const [currentIndex, setCurrentIndex] = useState(initial.currentIndex);
  const [answers, setAnswers] = useState<Answers>(initial.answers);
  const [showResults, setShowResults] = useState(initial.showResults);
  const [saved, setSaved] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try { setSaved(saveQuizSession(sessionStorage, { answers, currentIndex, showResults })); }
    catch { setSaved(false); }
  }, [answers, currentIndex, showResults]);
  useEffect(() => { headingRef.current?.focus(); }, [currentIndex, showResults]);

  const question = quizQuestions[currentIndex];
  const progress = Object.keys(answers).length / quizQuestions.length * 100;
  const currentThemeIndex = themes.indexOf(question.theme);
  const result = useMemo(() => showResults ? calculateResult(answers) : null, [showResults, answers]);
  const resetQuiz = () => {
    setAnswers({}); setCurrentIndex(0); setShowResults(false);
  };
  // Results view
  if (showResults && result) {
    const cfg = levelConfig[result.level];
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs" data-testid="button-back-home"><Link href="/">
                <ArrowLeft className="w-3.5 h-3.5" />
                Accueil
              </Link></Button>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">Résultats</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {/* Score card */}
          <Card className={`border ${cfg.border} ${cfg.bg} mb-6`}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{cfg.emoji}</div>
              <h1 ref={headingRef} tabIndex={-1} className="text-sm font-medium text-muted-foreground mb-1">Votre score de cybersécurité</h1>
              <div className={`text-4xl font-bold ${cfg.color} mb-1`}>{result.percentage}%</div>
              <div className={`text-sm font-semibold ${cfg.color}`}>Niveau : {cfg.label}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {result.score} / {result.maxScore} points
              </div>
            </CardContent>
          </Card>

          {/* Theme breakdown */}
          <h2 className="text-sm font-semibold mb-3">Détail par thème</h2>
          <div className="space-y-3 mb-6">
            {result.themeScores.map((ts) => {
              const tsLevel = ts.percentage >= 70 ? "bon" : ts.percentage >= 50 ? "moyen" : ts.percentage >= 30 ? "faible" : "critique";
              const tsCfg = levelConfig[tsLevel];
              return (
                <Card key={ts.theme} className="border border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ts.themeIcon}</span>
                        <span className="text-sm font-medium">{ts.theme}</span>
                      </div>
                      <span className={`text-sm font-bold ${tsCfg.color}`}>{ts.percentage}%</span>
                    </div>
                    <Progress value={ts.percentage} aria-label={ts.theme} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommendations */}
          <h2 className="text-sm font-semibold mb-3">Recommandations</h2>
          <Card className="border border-border/60 mb-6">
            <CardContent className="p-4 space-y-2">
              {result.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{r}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">
            Votre bilan est disponible ici, sans fournir d'adresse email. Vos réponses restent dans cet onglet.
            {" "}<Link href="/contact" className="text-primary underline">Nous contacter</Link>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowResults(false)}>Revoir mes réponses</Button>
            <Button variant="ghost" onClick={resetQuiz}>Effacer et recommencer</Button>
          </div>
          {!saved && <p role="status" className="mt-3 text-sm">La reprise est indisponible dans ce navigateur. Gardez cette page ouverte.</p>}
          {/* CTA formation */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Ce bilan est une auto-évaluation de vos pratiques, pas un audit technique ni une certification. La formation est en préparation.
            </p>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" disabled data-testid="button-formation-cta">
              <Shield className="w-3.5 h-3.5" />
              Formation bientôt disponible
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs" data-testid="button-back-quiz"><Link href="/">
              <ArrowLeft className="w-3.5 h-3.5" />
              Quitter
            </Link></Button>
          <div className="flex-1">
            <Progress value={progress} aria-label="Questions répondues" className="h-1.5" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {currentIndex + 1}/{quizQuestions.length}
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* Theme indicator */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-base">{question.themeIcon}</span>
          <span className="text-xs font-medium text-primary">{question.theme}</span>
          <span className="text-xs text-muted-foreground">— Thème {currentThemeIndex + 1}/5</span>
        </div>

        <h1 ref={headingRef} tabIndex={-1} id="quiz-question" className="text-base sm:text-lg font-semibold mb-6 leading-relaxed" data-testid="text-question">
          {question.question}
        </h1>

        <div className="space-y-3" role="group" aria-labelledby="quiz-question">
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setAnswers((previous) => ({ ...previous, [question.id]: idx }))}
                className={`w-full text-left p-4 rounded-lg border transition-all text-sm leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-card hover:border-primary/30 hover:bg-card/80 text-foreground"
                }`}
                data-testid={`option-${idx}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground" role="status">
          {saved ? "Votre progression est conservée dans cet onglet, pendant 24 heures maximum." : "La reprise est indisponible dans ce navigateur. Gardez cette page ouverte."}
        </p>
        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="text-xs gap-1"
            data-testid="button-prev"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Précédent
          </Button>
          <Button size="sm" disabled={answers[question.id] === undefined}
            onClick={() => currentIndex < quizQuestions.length - 1 ? setCurrentIndex(currentIndex + 1) : setShowResults(true)}
            className="text-xs gap-1" data-testid="button-next">
            {currentIndex < quizQuestions.length - 1 ? "Suivant" : "Voir mon bilan"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
