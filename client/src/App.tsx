import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import Home from "@/pages/home";
const Quiz = lazy(() => import("@/pages/quiz"));
const Information = lazy(() => import("@/pages/information"));
const NotFound = lazy(() => import("@/pages/not-found"));

function AppRouter() {
  const [location] = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "MonCyberBilan — Évaluez votre cybersécurité", "/quiz": "Votre diagnostic — CyberBilan",
      "/confidentialite": "Confidentialité — CyberBilan", "/mentions-legales": "Mentions légales — CyberBilan",
      "/contact": "Contact — CyberBilan",
    };
    document.title = titles[location] || "Page introuvable — CyberBilan";
    document.querySelector('meta[name="robots"]')?.setAttribute("content", location === "/" ? "index,follow" : "noindex,follow");
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <Suspense fallback={<p role="status" className="p-8">Chargement…</p>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/confidentialite">{() => <Information kind="privacy" />}</Route>
        <Route path="/mentions-legales">{() => <Information kind="legal" />}</Route>
        <Route path="/contact">{() => <Information kind="contact" />}</Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <AppRouter />
  );
}

export default App;
