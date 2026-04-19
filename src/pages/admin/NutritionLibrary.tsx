import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Utensils, MoreVertical, Edit3, Trash2, Loader2, X, Tag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useMealLibrary, useCreateMeal } from '@/hooks/useNutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const DIETARY_TAGS = ['Vegan', 'Keto', 'High Protein', 'Gluten Free', 'High Fiber', 'Omega-3', 'Bulking', 'Low-Carb'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function CreateMealModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMeal = useCreateMeal();
  const [form, setForm] = useState({ title: '', category: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', instructions: '', tags: [] as string[] });
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));
  };

  const handleSave = () => {
    if (!form.title.trim()) { setError('Meal name is required.'); return; }
    if (!form.calories || !form.protein) { setError('Calories and protein are required.'); return; }
    setError('');
    createMeal.mutate({
      title: form.title,
      category: form.category,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
      instructions: form.instructions,
      tags: form.tags,
    }, { onSuccess: onClose });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Utensils className="size-6 text-emerald-400" /></div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Recipe</h2>
              <p className="text-sm text-muted-foreground">Add a meal to the global nutrition library.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white"><X className="size-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {error && <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meal Name *</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="e.g. High-Protein Oats" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meal Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calories *</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="450" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protein (g) *</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="30" value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Carbs (g)</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="55" value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fats (g)</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="12" value={form.fats} onChange={e => setForm({...form, fats: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preparation Instructions</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none h-28" placeholder="Step-by-step instructions for preparing this meal..." value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Tag className="size-3" /> Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={cn("px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all", form.tags.includes(tag) ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20")}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>Discard</Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold px-8 shadow-lg shadow-emerald-500/20" onClick={handleSave} disabled={createMeal.isPending}>
            {createMeal.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
            {createMeal.isPending ? 'Saving...' : 'Add to Library'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function NutritionLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: meals = [], isLoading } = useMealLibrary();

  const deleteMeal = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/api/meals/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meal-library'] }),
  });

  const filtered = meals.filter((meal: any) => {
    const matchSearch = meal.title?.toLowerCase().includes(searchTerm.toLowerCase()) || meal.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = !activeFilter || meal.category === activeFilter || meal.type === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight uppercase italic">Nutrition Vault</h1>
          <p className="text-muted-foreground mt-1 text-sm">Design, refine, and catalog premium recipes for your athletes.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-8 h-12 rounded-2xl">
          <Plus className="size-5" /> Create Recipe
        </Button>
      </div>

      <Card className="glass border-white/5 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Search by meal name or tag..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {MEAL_TYPES.map(type => (
              <button key={type} onClick={() => setActiveFilter(activeFilter === type ? null : type)} className={cn("px-4 py-2 rounded-xl text-xs font-bold border transition-all", activeFilter === type ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 border-white/10 text-muted-foreground hover:text-white")}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-64 rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
          <Utensils className="size-16 text-white/5 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">No recipes found</h3>
          <p className="text-sm text-muted-foreground mb-8">Create your first recipe to populate the nutrition library.</p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-white font-bold">Create Recipe</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((meal: any) => {
            const name = meal.title || meal.name;
            const type = meal.category || meal.type;
            return (
              <Card key={meal.id} className="glass border-white/5 group hover:border-emerald-400/40 transition-all overflow-hidden rounded-3xl relative">
                <div className="aspect-[4/3] bg-black/40 relative overflow-hidden">
                  {meal.image ? <img src={meal.image} alt={name} className="size-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" /> : <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 text-white/5" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{type}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-9 bg-black/40 hover:bg-black/60 rounded-xl backdrop-blur-md border border-white/10">
                          <MoreVertical className="size-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0F1115] border-white/10 text-white rounded-2xl w-44 shadow-2xl">
                        <DropdownMenuItem className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer">
                          <Edit3 className="size-4 text-emerald-400" /> Edit Recipe
                        </DropdownMenuItem>
                        <div className="h-px bg-white/5 my-1" />
                        <DropdownMenuItem onClick={() => deleteMeal.mutate(meal.id)} className="gap-3 py-3 rounded-xl focus:bg-white/5 cursor-pointer text-rose-400">
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{name}</h3>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'CAL', val: meal.calories, color: 'text-white' },
                      { label: 'PRO', val: meal.protein, color: 'text-emerald-400' },
                      { label: 'CARB', val: meal.carbs, color: 'text-amber-400' },
                      { label: 'FAT', val: meal.fats, color: 'text-blue-400' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className="text-[8px] font-black text-muted-foreground tracking-tighter uppercase">{stat.label}</div>
                        <div className={cn("text-xs font-black", stat.color)}>{stat.val}{stat.label !== 'CAL' && 'g'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {(meal.tags || []).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-[9px] font-bold border-white/10 opacity-70 bg-white/5">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateMealModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
