import React, { useState } from 'react';
import { X, UserPlus, Shield, User, Mail, Lock, Loader2, CheckCircle2, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'coach' | 'admin'
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    // Ensure we meet all categories
    retVal += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    retVal += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    retVal += "0123456789"[Math.floor(Math.random() * 10)];
    retVal += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    for (let i = 0; i < 10; ++i) {
      retVal += charset[Math.floor(Math.random() * charset.length)];
    }
    // Shuffle
    retVal = retVal.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData({ ...formData, password: retVal, confirmPassword: retVal });
    setShowPassword(true);
    toast.success('Secure Password Generated');
  };

  const { getToken } = useAuth();
  
  const createUser = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = await getToken();
      await api.post('/api/users/create', data, {
         headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Member Synchronized Successfully');
      onClose();
      setFormData({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', role: 'user' });
      setStep(1);
    },
    onError: (err: any) => {
      console.error('[BekFit DEBUG] Provisioning Error:', err);
      const url = err?.config?.url || 'unknown';
      const base = err?.config?.baseURL || 'relative';
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to provision user.';
      setError(`${serverMsg} (Endpoint: ${base}${url})`);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    createUser.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UserPlus className="size-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Direct Provisioning</h2>
              <p className="text-sm text-muted-foreground font-medium">Bypass invitation flow and onboard member manually.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm font-bold uppercase tracking-widest">{error}</div>}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white focus:border-primary/50" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white focus:border-primary/50" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Designation</label>
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                 {['user', 'coach', 'admin'].map((role) => (
                    <button type="button" key={role} onClick={() => setFormData({...formData, role: role as any})} className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", formData.role === role ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5")}>
                       {role === 'user' ? 'Athlete' : role}
                    </button>
                 ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Master Password</label>
                <button type="button" onClick={generatePassword} className="text-[9px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                  <Zap className="size-3" /> Suggest Secure
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  minLength={8} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white focus:border-primary/50" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Standard</label>
               <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight text-white/40">
                     <CheckCircle2 className={cn("size-3", formData.password.length >= 8 ? "text-emerald-400" : "text-white/20")} /> Minimum 8-16 Chars
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight text-white/40">
                     <CheckCircle2 className={cn("size-3", /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "text-emerald-400" : "text-white/20")} /> Upper & Lowercase
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight text-white/40">
                     <CheckCircle2 className={cn("size-3", /[0-9]/.test(formData.password) ? "text-emerald-400" : "text-white/20")} /> Numeric Digit
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight text-white/40">
                     <CheckCircle2 className={cn("size-3", /[^A-Za-z0-9]/.test(formData.password) ? "text-emerald-400" : "text-white/20")} /> Special Symbol
                  </div>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
             <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl px-8 uppercase font-black tracking-widest text-[10px]">Backtrack</Button>
             <Button type="submit" disabled={createUser.isPending} className="bg-primary hover:bg-primary/90 px-12 h-14 rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-primary/20">
                {createUser.isPending ? <Loader2 className="size-5 mr-3 animate-spin" /> : <Shield className="size-5 mr-3" />}
                Authorize Membership
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
