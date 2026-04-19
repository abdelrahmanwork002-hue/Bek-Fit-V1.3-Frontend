import React, { useState } from 'react';
import { 
  Users, Search, Filter, RefreshCw, UserPlus, MoreHorizontal, 
  Shield, Activity, Calendar, Mail, CheckCircle2, AlertCircle,
  TrendingUp, BarChart3, History, ArrowRight, UserCircle,
  Lock, Unlock, ChevronDown, UserSquare2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'coach' | 'admin';
  status: 'active' | 'suspended';
  coachId: string | null;
  createdAt: string;
}

export function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'coach' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/api/users');
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      await api.patch(`/api/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User Permissions Updated');
    }
  });

  const filtered = users.filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const coaches = users.filter(u => u.role === 'coach');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase italic">Member Governance</h1>
           <p className="text-sm text-muted-foreground font-medium mt-1 uppercase tracking-widest text-[10px]">Access Control • Adherence Monitoring • System Roles</p>
        </div>
        <div className="flex items-center gap-3">
           <Button onClick={() => refetch()} variant="ghost" size="icon" className="size-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-primary transition-all">
              <RefreshCw className={cn("size-5", isLoading && "animate-spin")} />
           </Button>
           <Button className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 px-8 h-12 rounded-2xl font-black uppercase tracking-widest italic">
              <UserPlus className="size-5 mr-3" /> Invite New Member
           </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
               className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] text-white transition-all" 
               placeholder="Filter by name, email or hardware ID..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
            {['all', 'user', 'coach', 'admin'].map((role) => (
               <button 
                  key={role}
                  onClick={() => setRoleFilter(role as any)}
                  className={cn(
                     "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     roleFilter === role ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-white/5"
                  )}
               >
                  {role}
               </button>
            ))}
         </div>
      </div>

      {/* Main Table Area */}
      <Card className="glass border-white/5 overflow-hidden rounded-[40px] shadow-2xl">
         <div className="grid grid-cols-12 gap-px bg-white/5">
            <div className="col-span-4 p-6 bg-[#0F1115] text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Entity</div>
            <div className="col-span-2 p-6 bg-[#0F1115] text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">System Role</div>
            <div className="col-span-2 p-6 bg-[#0F1115] text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</div>
            <div className="col-span-2 p-6 bg-[#0F1115] text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Assigned Coach</div>
            <div className="col-span-2 p-6 bg-[#0F1115] text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</div>

            {filtered.map((user) => (
               <React.Fragment key={user.id}>
                  <div className="col-span-4 p-6 bg-background/40 flex items-center gap-5 hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setSelectedUser(user)}>
                     <div className="size-14 rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-full object-cover" /> : <UserCircle className="size-8 text-muted-foreground/30" />}
                     </div>
                     <div>
                        <div className="text-white font-black italic uppercase tracking-tight italic group-hover:text-primary transition-colors text-lg">{user.fullName || 'Anonymous'}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 lowercase font-medium">
                           <Mail className="size-3" /> {user.email}
                        </div>
                     </div>
                  </div>

                  <div className="col-span-2 p-6 bg-background/40 flex items-center justify-center border-l border-white/5">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 hover:bg-white/5">
                              <Badge variant="outline" className={cn(
                                 "uppercase text-[9px] font-black border-none",
                                 user.role === 'admin' ? "text-primary" : user.role === 'coach' ? "text-emerald-400" : "text-sky-400"
                              )}>{user.role}</Badge>
                              <ChevronDown className="size-3 ml-2 text-muted-foreground" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0F1115] border-white/10">
                           <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'user' })}>Make Standard User</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'coach' })}>Promote to Coach</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, role: 'admin' })}>Promote to Admin</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  <div className="col-span-2 p-6 bg-background/40 flex items-center justify-center border-l border-white/5">
                     <button 
                        onClick={() => updateMutation.mutate({ id: user.id, status: user.status === 'active' ? 'suspended' : 'active' })}
                        className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                        user.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                     )}>
                        {user.status === 'active' ? <Unlock className="size-3" /> : <Lock className="size-3" />}
                        {user.status}
                     </button>
                  </div>

                  <div className="col-span-2 p-6 bg-background/40 flex items-center justify-center border-l border-white/5">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="h-10 px-4 rounded-xl border border-white/5 hover:bg-white/5">
                              <div className="text-[10px] font-black uppercase text-muted-foreground">
                                 {coaches.find(c => c.id === user.coachId)?.fullName || 'None Assigned'}
                              </div>
                              <ChevronDown className="size-3 ml-3 text-muted-foreground" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0F1115] border-white/10 max-h-60 overflow-y-auto">
                           <DropdownMenuItem onClick={() => updateMutation.mutate({ id: user.id, coachId: null })}>Remove Assignment</DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-white/5" />
                           {coaches.map(coach => (
                              <DropdownMenuItem key={coach.id} onClick={() => updateMutation.mutate({ id: user.id, coachId: coach.id })}>
                                 {coach.fullName}
                              </DropdownMenuItem>
                           ))}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  <div className="col-span-2 p-6 bg-background/40 flex items-center justify-end border-l border-white/5">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-white/5">
                              <MoreHorizontal className="size-5" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0F1115] border-white/10 w-56">
                           <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-3">Interventions</DropdownMenuLabel>
                           <DropdownMenuItem className="p-3 gap-3">
                              <Zap className="size-4 text-primary" /> Create Direct Plan
                           </DropdownMenuItem>
                           <DropdownMenuItem className="p-3 gap-3">
                              <Activity className="size-4 text-emerald-400" /> Pulse Analysis
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-white/5" />
                           <DropdownMenuItem className="p-3 gap-3 text-rose-400">
                              <Trash2 className="size-4" /> Permanent Delete
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </React.Fragment>
            ))}
         </div>
         
         {filtered.length === 0 && !isLoading && (
            <div className="p-32 text-center flex flex-col items-center gap-6">
               <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground opacity-10">
                  <Activity className="size-10" />
               </div>
               <div>
                  <h3 className="text-xl font-black italic text-white uppercase italic tracking-tighter">No biological signatures found</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">Either your search parameters are too narrow or the synchronization process is currently idle.</p>
               </div>
            </div>
         )}
      </Card>

      {/* Detail Slideover or Modal (Placeholder for Story 8.1 Detail View) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
           <div className="relative w-full max-w-2xl bg-[#0F1115] border-l border-white/5 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
              {/* Similar to Pulse Modal but focusing on Identity/Roles/Audit */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0F1115] z-10">
                 <div className="flex items-center gap-6">
                    <div className="size-20 rounded-[30px] border border-primary/20 overflow-hidden p-1">
                       <div className="size-full rounded-[26px] bg-primary/10 flex items-center justify-center border border-primary/20">
                          {selectedUser.avatarUrl ? <img src={selectedUser.avatarUrl} alt="" className="size-full object-cover rounded-[26px]" /> : <UserSquare2 className="size-10 text-primary" />}
                       </div>
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase italic italic tracking-tighter">{selectedUser.fullName}</h2>
                       <Badge className="bg-primary/20 text-primary text-[8px] uppercase tracking-widest mt-1 border border-primary/10">{selectedUser.role} Profile</Badge>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)} className="rounded-full">
                    <X className="size-6" />
                 </Button>
              </div>

              <div className="p-10 space-y-12">
                 <div className="grid grid-cols-2 gap-6">
                    <Card className="bg-white/5 border-white/5 p-6 space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Calendar className="size-3" /> Registration
                       </div>
                       <div className="text-lg font-black text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                    </Card>
                    <Card className="bg-white/5 border-white/5 p-6 space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Shield className="size-3" /> Security ID
                       </div>
                       <div className="text-[10px] font-mono text-muted-foreground truncate">{selectedUser.id}</div>
                    </Card>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">Behavioral Archetype</h3>
                    <div className="grid grid-cols-3 gap-4 font-black uppercase tracking-tighter italic">
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-2">
                          <div className="text-3xl text-primary">82%</div>
                          <div className="text-[8px] text-muted-foreground">Adherence</div>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-2">
                          <div className="text-3xl text-sky-400">6.4</div>
                          <div className="text-[8px] text-muted-foreground">Avg RPE</div>
                       </div>
                       <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-2">
                          <div className="text-3xl text-emerald-400">14</div>
                          <div className="text-[8px] text-muted-foreground">Current Streak</div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Governing Audit Trail</h3>
                       <History className="size-4 text-muted-foreground/30" />
                    </div>
                    {/* Audit logs would be mapped here */}
                    <div className="space-y-4">
                       {[
                         { action: 'Role Update', detail: 'Changed from user to coach', date: '2 days ago' },
                         { action: 'Security Login', detail: 'Authenticated via Google OAuth (Web)', date: '5 hours ago' }
                       ].map((log, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                           <div>
                              <div className="text-xs font-bold text-white uppercase tracking-tight">{log.action}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{log.detail}</div>
                           </div>
                           <div className="text-[9px] font-black uppercase text-muted-foreground italic">{log.date}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// Additional helper icons missing from imports
function Trash2(props: any) { return <X {...props} /> }
function X(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
}
