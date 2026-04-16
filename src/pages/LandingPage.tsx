import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Brain, Clock, Sparkles, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/i18n';

export function LandingPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-white">BekFit</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">How It Works</a>
            <a href="#success" className="text-sm text-muted-foreground hover:text-white transition-colors">Success Stories</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <Link to="/app">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button className="text-sm">{t('explore')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="size-3" />
            <span>AI-Powered Wellness Engine V3.0</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1]">
            Elevate your <span className="gradient-text">vitality</span> in minutes
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Personalized health optimization for busy professionals. Science-backed routines that adapt to your schedule, goals, and daily progress.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/onboarding">
              <Button size="lg" className="h-14 px-8 text-base font-semibold border-b-4 border-primary/40 active:border-b-0 active:translate-y-1 transition-all">
                Get Started for Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base">
              See the Science
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t border-white/5">
            {[
              { label: "Daily Routines", value: "5 min" },
              { label: "Active Users", value: "12k+" },
              { label: "Pain Relief", value: "88%" },
              { label: "AI Accuracy", value: "99.4%" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest leading-none">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="features" className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass group hover:border-primary/50 transition-all duration-500">
            <CardHeader>
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="size-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Hyper-Personalized</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Our AI analyzes your sitting hours, equipment, and fitness level to craft a plan that evolves with you.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass group hover:border-primary/50 transition-all duration-500">
            <CardHeader>
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="size-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Precision Timing</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Routines designed to fit into 5-minute gaps. Intelligent notifications that respect your deep work hours.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass group hover:border-primary/50 transition-all duration-500">
            <CardHeader>
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="size-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Instant Impact</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Targeted mobility and nutrition tips that reduce desk-fatigue and back pain starting from day one.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Activity className="size-5 text-primary" />
            <span className="font-bold tracking-tight text-white">BekFit</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 BekFit AI. Empowering professionals worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
