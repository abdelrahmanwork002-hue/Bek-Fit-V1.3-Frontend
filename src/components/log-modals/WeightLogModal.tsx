import React, { useState } from 'react';
import { X, Loader2, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';

interface WeightLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WeightLogModal({ isOpen, onClose, onSuccess }: WeightLogModalProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);
    try {
      const token = await getToken();
      setApiToken(token);
      await api.post('/api/logs/weight', {
        weightKg: parseFloat(weight),
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error logging weight:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp className="size-5 text-blue-400" />
            </div>
            <h2 className="font-bold text-white">Log Progress (Weight)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
              placeholder="e.g. 75.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !weight}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Weight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
