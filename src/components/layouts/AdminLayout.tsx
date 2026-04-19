import { Link, Outlet, useLocation } from 'react-router';
import { Activity, LayoutDashboard, Users, Dumbbell, Bot, BookOpen, Menu, X, ChevronLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { setApiToken } from '@/lib/api';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Dumbbell, label: 'Exercise Library', path: '/admin/exercises' },
  { icon: Activity, label: 'Nutrition Hub', path: '/admin/nutrition' },
  { icon: BookOpen, label: 'Plan Builder', path: '/admin/plans' },
  { icon: FileText, label: 'Content Studio', path: '/admin/blog' },
  { icon: Bot, label: 'AI Settings', path: '/admin/ai-settings' },
];

export function AdminLayout() {
  const location = useLocation();
  const { getToken } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLabel = adminNav.find(i => location.pathname === i.path)?.label ?? 'Admin';

  useEffect(() => {
    getToken().then(token => {
      setApiToken(token);
    });
  }, [getToken]);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background flex">
          {mobileOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          )}

          <aside className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-black/30 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}>
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Activity className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">BekFit</div>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-bold">Admin Portal</div>
                </div>
              </div>
              <button className="md:hidden p-1" onClick={() => setMobileOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {adminNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium',
                      isActive
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5">
              <Link
                to="/app"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
              >
                <ChevronLeft className="size-4" />
                Back to App
              </Link>
            </div>
          </aside>

          <main className="flex-1 md:ml-64 min-h-screen">
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/60 backdrop-blur-sm sticky top-0 z-30">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)}>
                  <Menu className="size-5" />
                </button>
                <h2 className="text-lg font-semibold">{currentLabel}</h2>
              </div>
              <UserButton afterSignOutUrl="/" />
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
