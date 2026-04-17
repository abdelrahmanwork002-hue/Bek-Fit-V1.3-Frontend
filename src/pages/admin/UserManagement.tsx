import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import api, { setApiToken } from '@/lib/api';
import { Sparkles, ShieldCheck, User, Search } from 'lucide-react';
import { AISupportModal } from '@/components/admin/AISupportModal';

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'coach' | 'admin';
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

  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  const { data: users = [], isLoading } = useQuery<UserRecord[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/api/users');
      return data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.patch(`/api/users/${id}/role`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage roles and AI support for all platform members.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-64"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr,auto,auto] md:grid-cols-[1fr,140px,140px,120px] gap-px bg-white/5">
          {/* Header */}
          <div className="bg-[#111827] p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</div>
          <div className="bg-[#111827] p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:block">Role</div>
          <div className="bg-[#111827] p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:block">Last Active</div>
          <div className="bg-[#111827] p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</div>
        </div>

        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,140px,140px,120px] gap-px bg-white/5">
              <div className="bg-background p-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-40 mb-2" />
                <div className="h-3 bg-white/5 rounded w-56" />
              </div>
              <div className="bg-background p-4 hidden md:block animate-pulse" />
              <div className="bg-background p-4 hidden md:block animate-pulse" />
              <div className="bg-background p-4 animate-pulse" />
            </div>
          ))
        ) : filtered.map((user) => (
          <div key={user.id} className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,140px,140px,120px] gap-px bg-white/5 hover:bg-primary/2 transition-colors group">
            {/* User info */}
            <div className="bg-background p-4 flex items-center gap-3">
              <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                {user.role === 'admin' ? <ShieldCheck className="size-4 text-primary" /> : <User className="size-4 text-muted-foreground" />}
              </div>
              <div>
                <div className="font-medium text-white">{user.fullName || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>

            {/* Role */}
            <div className="bg-background p-4 hidden md:flex items-center">
              <select
                value={user.role}
                onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                className={`text-xs font-bold border rounded-lg px-3 py-1.5 bg-transparent cursor-pointer focus:outline-none ${ROLE_COLORS[user.role]}`}
              >
                {ROLES.map(r => <option key={r} value={r} className="bg-[#111827] text-white">{r}</option>)}
              </select>
            </div>

            {/* Last active */}
            <div className="bg-background p-4 hidden md:flex items-center">
              <span className="text-xs text-muted-foreground">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '—'}
              </span>
            </div>

            {/* Actions */}
            <div className="bg-background p-4 flex items-center">
              <button
                onClick={() => setAiUser(user)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="size-3" />
                <span className="hidden md:inline">AI Draft</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AISupportModal
        isOpen={!!aiUser}
        onClose={() => setAiUser(null)}
        user={aiUser}
      />
    </div>
  );
}
