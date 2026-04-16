import { Link, Outlet, useLocation } from 'react-router';
import { Shield, Users, Library, ClipboardList, MessageSquare, Bot, LayoutDashboard, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/clerk-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: Library, label: 'Exercise Library', path: '/admin/exercises' },
  { icon: ClipboardList, label: 'Plan Builder', path: '/admin/plans' },
  { icon: Bot, label: 'AI Management', path: '/admin/ai-settings' },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0c10] flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-primary" />
            <span className="font-bold text-lg">BekFit Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link to="/app">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              <ChevronLeft className="size-4 mr-2" />
              User App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 bg-background px-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            System Status: <span className="text-emerald-400 font-medium">Healthy</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-white font-medium">Administrator</div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
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
