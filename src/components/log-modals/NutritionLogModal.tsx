import React, { useState } from 'react';
import { X, Loader2, Utensils } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';

interface NutritionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NutritionLogModal({ isOpen, onClose, onSuccess }: NutritionLogModalProps) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    calories: '',
    proteinG: '',
    carbsG: '',
    fatsG: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      setApiToken(token);
      await api.post('/api/logs/nutrition', {
        ...formData,
        calories: parseInt(formData.calories) || 0,
        proteinG: parseInt(formData.proteinG) || 0,
        carbsG: parseInt(formData.carbsG) || 0,
        fatsG: parseInt(formData.fatsG) || 0,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error logging nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Utensils className="size-5 text-emerald-400" />
            </div>
            <h2 className="font-bold text-white">Log Nutrition</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Meal Type</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Calories (kcal)</label>
            <input
              type="number"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="e.g. 500"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Protein (g)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="20"
                value={formData.proteinG}
                onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Carbs (g)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="50"
                value={formData.carbsG}
                onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Fats (g)</label>
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="15"
                value={formData.fatsG}
                onChange={(e) => setFormData({ ...formData, fatsG: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
