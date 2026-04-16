import { Link, Outlet, useLocation } from 'react-router';
import { Activity, Calendar, LayoutDashboard, User, Utensils, Lightbulb, Bell, Shield, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageToggle } from '../LanguageToggle';
import { useLanguage } from '@/lib/i18n';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/clerk-react';
import { useState } from 'react';

export function AppLayout() {
  const location = useLocation();
  const { t, lang } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/app' },
    { icon: Calendar, label: t('progress'), path: '/app/progress' },
    { icon: Utensils, label: t('nutrition'), path: '/app/nutrition' },
    { icon: Lightbulb, label: t('tips'), path: '/app/tips' },
    { icon: User, label: t('profile'), path: '/app/profile' },
  ];

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-black/20 backdrop-blur-xl border-white/5 fixed inset-y-0 z-[70] transition-transform duration-300 md:translate-x-0 w-64",
        isMobileMenuOpen ? "translate-x-0" : (lang === 'ar' ? "translate-x-full" : "-translate-x-full"),
        lang === 'ar' ? "right-0 border-l" : "left-0 border-r"
      )}>
        <div className="p-6 flex items-center gap-3">
          <Activity className="size-8 text-primary shrink-0" />
          <span className="hidden md:block text-2xl font-bold tracking-tight">BekFit</span>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app/routines');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(79,182,178,0.1)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("size-6 shrink-0", isActive && "scale-110")} />
                <span className="hidden md:block font-medium">{item.label}</span>
                {isActive && <div className={cn(
                  "hidden md:block absolute w-1 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(79,182,178,0.5)]",
                  lang === 'ar' ? "left-0 rounded-r-full" : "right-0 rounded-l-full"
                )} />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-8 hidden md:block text-center">
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2">
            <Shield className="size-3" />
            {t('admin')}
          </Link>
        </div>
      </aside>

      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        lang === 'ar' ? "md:mr-64 mr-0" : "md:ml-64 ml-0"
      )}>
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 md:hidden hover:bg-white/5 rounded-lg"
            >
              <Menu className="size-6" />
            </button>
            <h2 className="text-xl font-semibold">
              {navItems.find(i => location.pathname === i.path)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <ThemeToggle />
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  </SignedIn>
  <SignedOut>
    <RedirectToSignIn />
  </SignedOut>
</>
);
}
