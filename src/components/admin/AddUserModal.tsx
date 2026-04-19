import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield, ShieldCheck, User as UserIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const inviteUser = useMutation({
    mutationFn: async (data: typeof formData) => {
      await api.post('/api/users/invite', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); setFormData({ fullName: '', email: '', role: 'user' }); }, 1500);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to send invitation. Check your connection.');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.fullName.trim()) { setError('Full name is required.'); return; }
    if (!formData.email.trim() || !formData.email.includes('@')) { setError('A valid email is required.'); return; }
    setError('');
    inviteUser.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              {success ? <CheckCircle2 className="size-6 text-emerald-400" /> : <UserPlus className="size-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Invite Member</h2>
              <p className="text-sm text-muted-foreground">Grant access to the BekFit ecosystem.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">{error}</div>}
          {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold">Invitation sent successfully!</div>}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name *</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" placeholder="e.g. John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assign System Role</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'user', icon: UserIcon, label: 'User', desc: 'Athlete access' },
                { id: 'coach', icon: Shield, label: 'Coach', desc: 'Plan builder' },
                { id: 'admin', icon: ShieldCheck, label: 'Admin', desc: 'Full control' },
              ].map((role) => (
                <button key={role.id} onClick={() => setFormData({ ...formData, role: role.id })} className={cn("p-4 rounded-2xl border transition-all text-left space-y-2", formData.role === role.id ? "bg-primary/10 border-primary/40" : "bg-white/5 border-white/10 hover:border-white/20")}>
                  <role.icon className={cn("size-5", formData.role === role.id ? "text-primary" : "text-muted-foreground")} />
                  <div>
                    <div className={cn("text-xs font-bold", formData.role === role.id ? "text-white" : "text-muted-foreground")}>{role.label}</div>
                    <div className="text-[9px] text-muted-foreground">{role.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>Discard</Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8 font-bold" onClick={handleSubmit} disabled={inviteUser.isPending}>
            {inviteUser.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
            {inviteUser.isPending ? 'Sending...' : 'Send Invitation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
