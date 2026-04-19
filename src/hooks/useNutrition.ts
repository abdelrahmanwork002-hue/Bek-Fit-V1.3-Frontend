import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setApiToken } from '@/lib/api';

const MOCK_MEALS = [
  { id: '1', type: 'Breakfast', name: 'Avocado Toast with Poached Eggs', calories: 450, protein: 22, carbs: 35, fats: 25, completed: false, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80', instructions: 'Toast the bread. Mash avocado with lemon juice. Poach eggs for 3 mins.', tags: ['High Protein'] },
  { id: '2', type: 'Lunch', name: 'Grilled Chicken Quinoa Bowl', calories: 580, protein: 45, carbs: 55, fats: 15, completed: false, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', instructions: 'Grill chicken breast. Mix quinoa with roasted veggies and lemon tahini dressing.', tags: ['High Protein', 'Gluten Free'] },
  { id: '3', type: 'Dinner', name: 'Baked Salmon with Asparagus', calories: 510, protein: 38, carbs: 10, fats: 32, completed: false, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80', instructions: 'Season salmon with herbs. Bake at 200C for 15 mins with asparagus.', tags: ['Keto', 'Omega-3'] },
  { id: '4', type: 'Snack', name: 'Greek Yogurt with Berries', calories: 200, protein: 15, carbs: 20, fats: 5, completed: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80', instructions: 'Mix 200g Greek yogurt with fresh blueberries and a drizzle of honey.', tags: ['Vegan'] },
];

const MOCK_LIBRARY = [
  { id: 'sub1', name: 'Oatmeal with Almonds', calories: 420, protein: 15, carbs: 50, fats: 12, type: 'Breakfast', tags: ['Vegan', 'High Fiber'], image: 'https://images.unsplash.com/photo-1517433662323-146316ec711d?auto=format&fit=crop&w=400&q=80', instructions: 'Boil oats in milk. Top with raw almonds.' },
  { id: 'sub2', name: 'Turkey & Swiss Wrap', calories: 510, protein: 35, carbs: 45, fats: 18, type: 'Lunch', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1548946522-4a313e8972a4?auto=format&fit=crop&w=400&q=80', instructions: 'Wrap sliced turkey and swiss cheese in a whole wheat tortilla.' },
  { id: 'sub3', name: 'Grilled Steak & Greens', calories: 620, protein: 55, carbs: 12, fats: 38, type: 'Dinner', tags: ['Keto', 'High Protein'], image: 'https://images.unsplash.com/photo-1514516369414-78177d40e990?auto=format&fit=crop&w=400&q=80', instructions: 'Grill steak to preference. Serve with fresh lettuce and spinach.' },
  { id: 'sub4', name: 'Hummus & Carrots', calories: 180, protein: 8, carbs: 22, fats: 10, type: 'Snack', tags: ['Vegan', 'Gluten Free'], image: 'https://images.unsplash.com/photo-1541533375320-fed818ec0981?auto=format&fit=crop&w=400&q=80', instructions: 'Dip fresh baby carrots into 3 tbsp of hummus.' },
  { id: 'sub5', name: 'Protein Pancakes', calories: 350, protein: 30, carbs: 40, fats: 8, type: 'Breakfast', tags: ['High Protein'], image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80', instructions: 'Mix protein powder, oats, and egg whites. Cook on medium heat.' },
  { id: 'sub6', name: 'Quinoa & Black Beans', calories: 440, protein: 18, carbs: 75, fats: 6, type: 'Lunch', tags: ['Vegan', 'Gluten Free'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', instructions: 'Boil quinoa. Mix with canned black beans and salsa.' },
];

export function useTodayMeals() {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['nutrition-today'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/nutrition/today');
        return data?.meals?.length ? data.meals : MOCK_MEALS;
      } catch {
        return MOCK_MEALS;
      }
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useMealLibrary() {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['meal-library'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/meals');
        return data?.length ? data : MOCK_LIBRARY;
      } catch {
        return MOCK_LIBRARY;
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log: { type: string; name: string; calories: number; protein: number; carbs: number; fats: number }) => {
      try {
        await api.post('/api/logs/nutrition', { ...log, timestamp: new Date().toISOString() });
      } catch { /* offline */ }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nutrition-today'] }),
  });
}

export function useSwapMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ mealId, replacement }: { mealId: string; replacement: any }) => {
      try {
        await api.patch(`/api/nutrition/today/${mealId}/swap`, { replacementId: replacement.id });
      } catch { /* offline */ }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nutrition-today'] }),
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (meal: any) => {
      const { data } = await api.post('/api/meals', meal);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meal-library'] }),
  });
}
