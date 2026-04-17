import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, Flame, ChevronRight, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import { NutritionLogModal } from '@/components/log-modals/NutritionLogModal';

const mealPlan = [
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
];

export function Nutrition() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  const totalMacros = mealPlan.reduce((acc, meal) => ({
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
          <p className="text-muted-foreground mt-1">Daily meal plan and adherence tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white">
            <RefreshCw className="size-4 mr-2" /> Swap Meals
          </Button>
          <Button onClick={() => setIsLogOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
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
                className={`h-full rounded-full ${macro.color.replace('text', 'bg')}`} 
                style={{ width: `${Math.min(100, (macro.value / macro.goal) * 100)}%` }} 
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Meal Slots */}
      <div className="space-y-4">
        {mealPlan.map((meal) => (
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
                      <Info className="size-3 mr-2" /> View Recipe
                    </Button>
                    {meal.completed ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1.5 px-3">
                        <CheckCircle2 className="size-3 mr-2" /> Logged
                      </Badge>
                    ) : (
                      <Button className="bg-primary/20 hover:bg-primary text-white border border-primary/30 text-xs font-bold">
                        Log Meal
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="size-3" />
                    <span>Prep Time: 15-20 mins</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
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
                <Badge className="mb-2 bg-primary/20 text-primary border-primary/10">{selectedMeal.type}</Badge>
                <h2 className="text-2xl font-bold text-white">{selectedMeal.name}</h2>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preparation Instructions</h4>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{selectedMeal.instructions}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 font-bold">
                  Start Cooking
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent border-white/10" onClick={() => setSelectedMeal(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <NutritionLogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
