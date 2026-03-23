import { useState, useMemo } from "react";
import { Link } from "wouter";
import { quizQuestions, themes } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import type { QuizResult, ThemeScore } from "@shared/schema";

function calculateResult(answers: Record<string, number>): QuizResult {
  const maxScore = quizQuestions.length * 3;
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const themeScores: ThemeScore[] = themes.map((theme, idx) => {
    const themeQuestions = quizQuestions.filter((q) => q.theme === theme);
    const themeMax = themeQuestions.length * 3;
    const themeTotal = themeQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const icons = ["🔐", "🎣", "🛡️", "💻", "💰"];
    return {
      theme,
      themeIcon: icons[idx] || "📊",
      score: themeTotal,
      maxScore: themeMax,
      percentage: Math.round((themeTotal / themeMax) * 100),
    };
  });

  let level: QuizResult["level"];
  if (percentage >= 85) level = "excellent";
  else if (percentage >= 70) level = "bon";
  else if (percentage >= 50) level = "moyen";
  else if (percentage >= 30) level = "faible";
  else level = "critique";

  const recommendations: string[] = [];
  themeScores.forEach((ts) => {
    if (ts.percentage < 50) {
      recommendations.push(`Priorité : améliorer votre score en "${ts.theme}" (${ts.percentage}%)`);
    }
  });
  if (recommendations.length === 0) {
    recommendations.push("Bon niveau global. Continuez à maintenir vos bonnes pratiques.");
  }

  return { score: totalScore, maxScore, percentage, level, themeScores, recommendations };
}

const levelConfig = {
  critique: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", label: "Critique", emoji: "🔴" },
  faible: { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "Faible", emoji: "🟠" },
  moyen: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Moyen", emoji: "🟡" },
  bon: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", label: "Bon", emoji: "🟢" },
  excellent: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", label: "Excellent", emoji: "✅" },
};

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const question = quizQuestions[currentIndex];
  const progress = ((currentIndex + (answers[question?.id] !== undefined ? 1 : 0)) / quizQuestions.length) * 100;
  const currentTheme = question?.theme;
  const currentThemeIndex = themes.indexOf(currentTheme);

  const result = useMemo(() => {
    if (!showResults) return null;
    return calculateResult(answers);
  }, [showResults, answers]);

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleSubmitEmail = async () => {
    if (!result || !email) return;
    try {
      const { apiRequest } = await import("@/lib/queryClient");
      await apiRequest("POST", "/api/leads", {
        email,
        score: result.score,
        level: result.level,
        answers: JSON.stringify(answers),
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Still show success UX
    }
  };

  // Results view
  if (showResults && result) {
    const cfg = levelConfig[result.level];
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" data-testid="button-back-home">
                <ArrowLeft className="w-3.5 h-3.5" />
                Accueil
              </Button>
            </Link>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground">Résultats</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {/* Score card */}
          <Card className={`border ${cfg.border} ${cfg.bg} mb-6`}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{cfg.emoji}</div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Votre score de cybersécurité</div>
              <div className={`text-4xl font-bold ${cfg.color} mb-1`}>{result.percentage}%</div>
              <div className={`text-sm font-semibold ${cfg.color}`}>Niveau : {cfg.label}</div>
              <div className="text-xs text-muted-foreground mt-2">
                {result.score} / {result.maxScore} points
              </div>
            </CardContent>
          </Card>

          {/* Theme breakdown */}
          <h3 className="text-sm font-semibold mb-3">Détail par thème</h3>
          <div className="space-y-3 mb-6">
            {result.themeScores.map((ts) => {
              const tsLevel = ts.percentage >= 70 ? "bon" : ts.percentage >= 50 ? "moyen" : ts.percentage >= 30 ? "faible" : "critique";
              const tsCfg = levelConfig[tsLevel];
              return (
                <Card key={ts.theme} className="border border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ts.themeIcon}</span>
                        <span className="text-sm font-medium">{ts.theme}</span>
                      </div>
                      <span className={`text-sm font-bold ${tsCfg.color}`}>{ts.percentage}%</span>
                    </div>
                    <Progress value={ts.percentage} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommendations */}
          <h3 className="text-sm font-semibold mb-3">Recommandations</h3>
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

          {/* Email capture */}
          {!submitted ? (
            <Card className="border border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-1.5">Recevez votre rapport détaillé</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Entrez votre email pour recevoir votre bilan complet avec des conseils personnalisés et découvrir notre formation certifiée.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-email"
                  />
                  <Button onClick={handleSubmitEmail} disabled={!email.includes("@")} className="text-sm" data-testid="button-submit-email">
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-5 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold mb-1">Merci !</h3>
                <p className="text-xs text-muted-foreground">
                  Votre rapport sera envoyé à {email}. Nous vous contacterons dès que la formation sera disponible.
                </p>
              </CardContent>
            </Card>
          )}

          {/* CTA formation */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Envie de passer au niveau supérieur ? Notre formation certifiée couvre chaque thème en profondeur.
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
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" data-testid="button-back-quiz">
              <ArrowLeft className="w-3.5 h-3.5" />
              Quitter
            </Button>
          </Link>
          <div className="flex-1">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {currentIndex + 1}/{quizQuestions.length}
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* Theme indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-base">{question.themeIcon}</span>
          <span className="text-xs font-medium text-primary">{question.theme}</span>
          <span className="text-xs text-muted-foreground">— Thème {currentThemeIndex + 1}/5</span>
        </div>

        <h2 className="text-base sm:text-lg font-semibold mb-6 leading-relaxed" data-testid="text-question">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === opt.value;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full text-left p-4 rounded-lg border transition-all text-sm leading-relaxed ${
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
          {answers[question.id] !== undefined && currentIndex < quizQuestions.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="text-xs gap-1"
              data-testid="button-next"
            >
              Suivant
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
