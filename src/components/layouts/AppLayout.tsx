import { Link, Outlet, useLocation } from 'react-router';
import { Activity, Calendar, LayoutDashboard, User, Utensils, Lightbulb, Shield, Menu, X, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageToggle } from '../LanguageToggle';
import { useLanguage } from '@/lib/i18n';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { setApiToken } from '@/lib/api';

export function AppLayout() {
  const { getToken } = useAuth();
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateToken = async () => {
      const token = await getToken();
      setApiToken(token);
    };
    updateToken();
  }, [getToken]);

  const navItems = [
    { icon: LayoutDashboard, label: t('home'), path: '/app' },
    { icon: Calendar, label: t('progress'), path: '/app/progress' },
    { icon: Utensils, label: t('nutrition'), path: '/app/nutrition' },
    { icon: Brain, label: 'Insights', path: '/app/insights' },
    { icon: Lightbulb, label: t('tips'), path: '/app/tips' },
    { icon: User, label: t('profile'), path: '/app/profile' },
  ];

  const currentLabel = navItems.find(i => location.pathname === i.path)?.label ?? 'BekFit';

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background flex">
          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={cn(
              'fixed inset-y-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-white/5 transition-transform duration-300 flex flex-col',
              isRTL ? 'right-0 border-l' : 'left-0 border-r',
              mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'
            )}
          >
            {/* Logo */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="size-8 text-primary shrink-0" />
                <span className="text-2xl font-bold tracking-tight">BekFit</span>
              </div>
              <button className="md:hidden p-1" onClick={() => setMobileOpen(false)}>
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-1 mt-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app/routines');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(79,182,178,0.1)]'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className={cn('size-5 shrink-0', isActive && 'scale-110')} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className={cn(
                        'absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full shadow-[0_0_12px_rgba(79,182,178,0.6)]',
                        isRTL ? 'left-0 rounded-r-full' : 'right-0 rounded-l-full'
                      )} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Admin link */}
            <div className="p-6">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors uppercase tracking-widest font-bold"
              >
                <Shield className="size-3" />
                {t('admin')}
              </Link>
            </div>
          </aside>

          {/* Main */}
          <main className={cn('flex-1 min-h-screen', isRTL ? 'md:mr-64' : 'md:ml-64')}>
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/60 backdrop-blur-sm sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="size-5" />
                </button>
                <h2 className="text-lg font-semibold">{currentLabel}</h2>
              </div>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>

            <div className="p-6 md:p-8">
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
