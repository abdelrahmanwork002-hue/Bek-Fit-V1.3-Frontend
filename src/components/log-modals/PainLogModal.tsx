import React, { useState } from 'react';
import { X, Loader2, Activity } from 'lucide-react';
import { logService } from '@/services/logService';

interface PainLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PainLogModal({ isOpen, onClose, onSuccess }: PainLogModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bodyPart: '',
    painLevel: 0,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bodyPart) return;
    setLoading(true);
    try {
      await logService.savePainLog({
        ...formData,
        timestamp: new Date().toISOString()
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error logging pain:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Activity className="size-5 text-orange-400" />
            </div>
            <h2 className="font-bold text-white">Log Recovery Status</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Affected Body Part</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50"
              placeholder="e.g. Left Shoulder"
              value={formData.bodyPart}
              onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Pain Level (0-10)</label>
            <div className="flex justify-between gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, painLevel: level })}
                  className={`flex-1 h-10 rounded-lg text-xs font-bold border transition-all ${
                    formData.painLevel === level 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Notes / Context</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none h-24"
              placeholder="Describe what happened or how it feels..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !formData.bodyPart}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Recovery Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
