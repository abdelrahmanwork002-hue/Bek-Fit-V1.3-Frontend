import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, Flame, ChevronRight, CheckCircle2, Info, RefreshCw, X, Search, Filter, Leaf, Dumbbell, WheatOff } from 'lucide-react';
import { NutritionLogModal } from '@/components/log-modals/NutritionLogModal';
import { cn } from '@/lib/utils';

export function Nutrition() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [mealToSwapId, setMealToSwapId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const [meals, setMeals] = useState([
    {
      id: '1',
      type: 'Breakfast',
      name: 'Avocado Toast with Poached Eggs',
      calories: 450,
      protein: 22,
      carbs: 35,
      fats: 25,
      completed: true,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80',
      instructions: 'Toast the bread. Mash avocado with lemon juice. Poach eggs for 3 mins.'
    },
    {
      id: '2',
      type: 'Lunch',
      name: 'Grilled Chicken Quinoa Bowl',
      calories: 580,
      protein: 45,
      carbs: 55,
      fats: 15,
      completed: false,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      instructions: 'Grill chicken breast. Mix quinoa with roasted veggies and lemon tahini dressing.'
    },
    {
      id: '3',
      type: 'Dinner',
      name: 'Baked Salmon with Asparagus',
      calories: 510,
      protein: 38,
      carbs: 10,
      fats: 32,
      completed: false,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
      instructions: 'Season salmon with herbs. Bake at 200C for 15 mins with asparagus.'
    },
    {
      id: '4',
      type: 'Snack',
      name: 'Greek Yogurt with Berries',
      calories: 200,
      protein: 15,
      carbs: 20,
      fats: 5,
      completed: false,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
      instructions: 'Mix 200g Greek yogurt with fresh blueberries and a drizzle of honey.'
    }
  ]);

  const substitutionLibrary = [
    { id: 'sub1', name: 'Oatmeal with Almonds', calories: 420, protein: 15, carbs: 50, fats: 12, type: 'Breakfast', tags: ['Vegan', 'High Fiber'], image: 'https://images.unsplash.com/photo-1517433662323-146316ec711d?auto=format&fit=crop&w=400&q=80', instructions: 'Boil oats in milk. Top with raw almonds.' },
    { id: 'sub2', name: 'Turkey & Swiss Wrap', calories: 510, protein: 35, carbs: 45, fats: 18, type: 'Lunch', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1548946522-4a313e8972a4?auto=format&fit=crop&w=400&q=80', instructions: 'Wrap sliced turkey and swiss cheese in a whole wheat tortilla.' },
    { id: 'sub3', name: 'Grilled Steak & Greens', calories: 620, protein: 55, carbs: 12, fats: 38, type: 'Dinner', tags: ['Keto', 'High Protein'], image: 'https://images.unsplash.com/photo-1514516369414-78177d40e990?auto=format&fit=crop&w=400&q=80', instructions: 'Grill steak to preference. Serve with fresh lettuce and spinach.' },
    { id: 'sub4', name: 'Hummus & Carrots', calories: 180, protein: 8, carbs: 22, fats: 10, type: 'Snack', tags: ['Vegan', 'Gluten Free'], image: 'https://images.unsplash.com/photo-1541533375320-fed818ec0981?auto=format&fit=crop&w=400&q=80', instructions: 'Dip fresh baby carrots into 3 tbsp of hummus.' },
    { id: 'sub5', name: 'Protein Pancakes', calories: 350, protein: 30, carbs: 40, fats: 8, type: 'Breakfast', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80', instructions: 'Mix protein powder, oats, and egg whites. Cook on medium heat.' },
    { id: 'sub6', name: 'Quinoa & Black Beans', calories: 440, protein: 18, carbs: 75, fats: 6, type: 'Lunch', tags: ['Vegan', 'Gluten Free'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', instructions: 'Boil quinoa. Mix with canned black beans and salsa.' },
  ];

  const mealToSwap = meals.find(m => m.id === mealToSwapId);

  const filteredLibrary = substitutionLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag ? item.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSwap = (replacementMeal: any) => {
    setMeals(prev => prev.map(m => 
      m.id === mealToSwapId 
        ? { ...replacementMeal, id: m.id, type: m.type, completed: false } 
        : m
    ));
    setIsSwapModalOpen(false);
    setMealToSwapId(null);
  };

  const totalMacros = meals.reduce((acc, meal) => ({
    cal: acc.cal + meal.calories,
    pro: acc.pro + meal.protein,
    car: acc.car + meal.carbs,
    fat: acc.fat + meal.fats,
  }), { cal: 0, pro: 0, car: 0, fat: 0 });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Nutrition Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your daily meal plan and macronutrient balance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white" onClick={() => { setMealToSwapId(null); setIsSwapModalOpen(true); }}>
            <RefreshCw className="size-4 mr-2" /> Meal Library
          </Button>
          <Button onClick={() => setIsLogOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20">
            Log Extra Meal
          </Button>
        </div>
      </div>

      {/* Daily Macro Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calories', value: totalMacros.cal, goal: 2000, color: 'text-primary' },
          { label: 'Protein', value: totalMacros.pro, goal: 120, color: 'text-emerald-400' },
          { label: 'Carbohydrates', value: totalMacros.car, goal: 250, color: 'text-amber-400' },
          { label: 'Total Fats', value: totalMacros.fat, goal: 65, color: 'text-blue-400' },
        ].map((macro, i) => (
          <Card key={i} className="glass p-6 border-white/5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{macro.label}</div>
            <div className="flex items-baseline gap-2">
              <div className={`text-2xl font-bold ${macro.color}`}>{macro.value}</div>
              <div className="text-xs text-muted-foreground">/ {macro.goal}g</div>
            </div>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", macro.color.replace('text', 'bg'))} 
                style={{ width: `${Math.min(100, (macro.value / macro.goal) * 100)}%` }} 
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Meal Slots */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <Card key={meal.id} className="glass border-white/5 overflow-hidden hover:border-white/10 transition-colors group">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-48 md:h-auto overflow-hidden relative">
                <img src={meal.image} alt={meal.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-[10px] uppercase font-bold">{meal.type}</Badge>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{meal.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Flame className="size-3 text-primary" /> {meal.calories} kcal
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-400" /> P: {meal.protein}g
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-amber-400" /> C: {meal.carbs}g
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-blue-400" /> F: {meal.fats}g
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/5 border-white/10 text-xs"
                      onClick={() => setSelectedMeal(meal)}
                    >
                      <Info className="size-3 mr-2" /> Recipe
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/5 border-white/10 text-xs hover:bg-primary/20 hover:text-primary transition-all font-bold"
                      onClick={() => { setMealToSwapId(meal.id); setIsSwapModalOpen(true); }}
                    >
                      <RefreshCw className="size-3 mr-2" /> Swap
                    </Button>
                    {meal.completed ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1.5 px-3">
                        <CheckCircle2 className="size-3 mr-2" /> Logged
                      </Badge>
                    ) : (
                      <Button className="bg-primary/20 hover:bg-primary text-white border border-primary/30 text-xs font-bold transition-all">
                        Log Meal
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-3" />
                    <span className="italic">Fresh Ingredients Recommended</span>
                  </div>
                  <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recipe Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-48">
              <img src={selectedMeal.image} className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] to-transparent" />
              <button 
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-md"
              >
                <X className="size-5 text-white" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <Badge className="mb-2 bg-primary/20 text-primary border-primary/10 uppercase text-[10px] font-bold tracking-widest">{selectedMeal.type}</Badge>
                <h2 className="text-2xl font-bold text-white">{selectedMeal.name}</h2>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preparation Instructions</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{selectedMeal.instructions}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 font-bold" onClick={() => setSelectedMeal(null)}>
                  Started Cooking
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent border-white/10" onClick={() => setSelectedMeal(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Swap Modal (Story 16) */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Meal Substitution Library</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mealToSwap ? `Swapping your ${mealToSwap.type} plan.` : 'Browse your personal recipe library.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsSwapModalOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="size-6 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search meals or categories..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['High Protein', 'Vegan', 'Gluten Free', 'Keto', 'High Fiber'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
                        activeTag === tag 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {filteredLibrary.length > 0 ? filteredLibrary.map((meal) => {
                const isMatch = mealToSwap?.type === meal.type;
                return (
                  <div key={meal.id} className={cn(
                    "p-5 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden",
                    !isMatch && mealToSwap && "opacity-60"
                  )}>
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-xl overflow-hidden border border-white/10">
                        <img src={meal.image} className="size-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-[10px] font-bold uppercase text-primary">{meal.type}</div>
                          {isMatch && <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] h-4">Perfect Match</Badge>}
                        </div>
                        <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{meal.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meal.tags.map(t => (
                            <span key={t} className="text-[8px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                              {t === 'Vegan' && <Leaf className="size-2 text-emerald-400" />}
                              {t === 'High Protein' && <Dumbbell className="size-2 text-primary" />}
                              {t === 'Gluten Free' && <WheatOff className="size-2 text-amber-400" />}
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest border-t border-white/5 pt-2">
                          <span>{meal.calories} kcal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fats}g</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSwap(meal)}
                      className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity font-bold",
                        mealToSwap ? "bg-primary text-white" : "bg-emerald-500 text-white"
                      )}
                    >
                      {mealToSwap ? 'Confirm Swap' : 'Select Meal'}
                    </Button>
                  </div>
                );
              }) : (
                <div className="text-center py-20">
                  <Utensils className="size-12 text-white/5 mx-auto mb-4" />
                  <p className="text-muted-foreground">No meals found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <NutritionLogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </div>
  );
}
