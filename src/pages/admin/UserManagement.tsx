import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api, { setApiToken } from '@/lib/api';
import { Sparkles, ShieldCheck, User, Search, MoreVertical, Ban, CheckCircle2, Eye, ShieldAlert, MessageSquare, Mail } from 'lucide-react';
import { AISupportModal } from '@/components/admin/AISupportModal';
import { UserAnalyticsModal } from '@/components/admin/UserAnalyticsModal';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { EditUserProfileModal } from '@/components/admin/EditUserProfileModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
  status?: 'active' | 'banned';
  updatedAt: string;
}

const ROLES = ['user', 'coach', 'admin'] as const;
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-primary/20 text-primary border-primary/30',
  coach: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  user: 'bg-white/10 text-gray-300 border-white/10',
};

export function UserManagement() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [aiUser, setAiUser] = useState<UserRecord | null>(null);
  const [analyticsUser, setAnalyticsUser] = useState<UserRecord | null>(null);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('[DEBUG] Fetching users from /api/users...');
      try {
        const { data } = await api.get('/api/users');
        console.log('[DEBUG] Users Received:', data);
        // Mocking some statuses for visual demonstration if not present
        return data.map((u: any) => ({ ...u, status: u.status || 'active' }));
      } catch (err) {
        console.error('[DEBUG] Fetch Failed:', err);
        throw err;
      }
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.patch(`/api/users/${id}/role`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'banned' }) => {
      // Logic for status toggle (API endpoint expected: PATCH /api/users/:id/status)
      await api.patch(`/api/users/${id}/status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Member Management</h1>
          <p className="text-muted-foreground mt-1">Control access levels, monitor adherence, and manage the platform community.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
              placeholder="Filter by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            className="bg-primary/20 text-primary border border-primary/20 hover:bg-primary font-bold transition-all"
            onClick={() => setIsAddUserOpen(true)}
          >
            Invite New Member
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[1fr,auto,auto] md:grid-cols-[1fr,150px,150px,200px] gap-px bg-white/5">
          {/* Header */}
          <div className="bg-[#0F1115] p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">User Profile</div>
          <div className="bg-[#0F1115] p-5 text-xs font-black uppercase tracking-widest text-muted-foreground hidden lg:block">Connectivity</div>
          <div className="bg-[#0F1115] p-5 text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:block">System Role</div>
          <div className="bg-[#0F1115] p-5 text-xs font-black uppercase tracking-widest text-muted-foreground hidden md:block">Engagement</div>
          <div className="bg-[#0F1115] p-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Governing Actions</div>
        </div>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,150px,150px,200px] gap-px bg-white/5">
              <div className="bg-background p-6 animate-pulse">
                <div className="h-5 bg-white/5 rounded w-48 mb-2" />
                <div className="h-3 bg-white/5 rounded w-64" />
              </div>
              <div className="bg-background p-6 hidden lg:block animate-pulse" />
              <div className="bg-background p-6 hidden md:block animate-pulse" />
              <div className="bg-background p-6 hidden md:block animate-pulse" />
              <div className="bg-background p-6 animate-pulse" />
            </div>
          ))
        ) : filtered.map((user) => {
          const isBanned = user.status === 'banned';
          return (
            <div key={user.id} className={cn(
              "grid grid-cols-[1fr,auto] md:grid-cols-[1fr,150px,150px,200px] gap-px bg-white/5 hover:bg-white/[0.04] transition-all group",
              isBanned && "opacity-50 grayscale"
            )}>
              {/* User info */}
              <div className="bg-background p-6 flex items-center gap-4">
                <div className={cn(
                  "size-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all shadow-lg",
                  user.role === 'admin' ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10"
                )}>
                  {user.role === 'admin' ? 
                    <ShieldCheck className="size-6 text-primary" /> : 
                    <User className="size-6 text-muted-foreground" />
                  }
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {user.fullName || 'N/A'}
                    {isBanned && <Badge variant="destructive" className="text-[8px] h-4 px-1.5 uppercase tracking-tighter">Banned</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
                </div>
              </div>

              {/* Communication Quick Actions */}
              <div className="bg-background p-6 hidden lg:flex items-center gap-2">
                 <a href={`mailto:${user.email}`} className="size-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all">
                    <Mail className="size-4" />
                 </a>
                 <a href={`https://wa.me/${user.id}`} target="_blank" className="size-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-400 transition-all">
                    <MessageSquare className="size-4" />
                 </a>
              </div>

              {/* Role Select */}
              <div className="bg-background p-6 hidden md:flex items-center">
                <select
                  disabled={isBanned}
                  value={user.role}
                  onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest border rounded-xl px-4 py-2 bg-transparent cursor-pointer focus:outline-none transition-all",
                    ROLE_COLORS[user.role]
                  )}
                >
                  {ROLES.map(r => <option key={r} value={r} className="bg-[#0F1115] text-white">{r}</option>)}
                </select>
              </div>

              {/* Engagement Status */}
              <div className="bg-background p-6 hidden md:flex items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-white">Daily Active</span>
                  <span className="text-[10px] text-muted-foreground">Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-background p-6 flex items-center justify-end md:justify-start gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary transition-all font-bold group/ai"
                  onClick={() => setAiUser(user)}
                >
                  <Sparkles className="size-3 group-hover/ai:animate-pulse" />
                  <span className="ml-2 hidden lg:inline">AI Draft</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0F1115] border-white/10 text-white rounded-2xl w-48 shadow-2xl">
                    <DropdownMenuItem onClick={() => setAnalyticsUser(user)} className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer">
                      <Eye className="size-4 text-primary" /> View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditUser(user)} className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer">
                      <ShieldAlert className="size-4 text-amber-400" /> Override Profile
                    </DropdownMenuItem>
                    <div className="h-px bg-white/5 my-1" />
                    <DropdownMenuItem 
                      onClick={() => statusMutation.mutate({ id: user.id, status: isBanned ? 'active' : 'banned' })}
                      className={cn(
                        "gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer font-bold",
                        isBanned ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isBanned ? <CheckCircle2 className="size-4" /> : <Ban className="size-4" />}
                      {isBanned ? 'Reinstate User' : 'Ban Account'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      <AISupportModal
        isOpen={!!aiUser}
        onClose={() => setAiUser(null)}
        user={aiUser}
      />

      <UserAnalyticsModal
        isOpen={!!analyticsUser}
        onClose={() => setAnalyticsUser(null)}
        user={analyticsUser}
      />

      <AddUserModal 
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />

      <EditUserProfileModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
      />
    </div>
  );
}
