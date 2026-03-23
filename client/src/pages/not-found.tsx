import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-muted-foreground mb-2">404</h1>
        <p className="text-sm text-muted-foreground mb-6">Page introuvable</p>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
