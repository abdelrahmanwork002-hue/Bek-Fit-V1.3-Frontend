-- BEK FIT V3.0 INITIAL SCHEMA

-- 1. Create Profiles table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  full_name TEXT,
  avatar_url TEXT,
  biological_sex TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  activity_level TEXT,
  fitness_goals TEXT[],
  language_preference TEXT DEFAULT 'en',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'coach', 'admin'))
);

-- 2. Create Exercises Library
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  target_muscle TEXT,
  equipment_needed TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))
);

-- 3. Create Routines
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  is_ai_generated BOOLEAN DEFAULT false,
  notes TEXT
);

-- 4. Create Routine Exercises (Junction table with reps/sets)
CREATE TABLE IF NOT EXISTS public.routine_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL,
  sets INTEGER,
  reps TEXT,
  duration_seconds INTEGER,
  rest_seconds INTEGER DEFAULT 60,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10)
);

-- 5. Create Pain Logs
CREATE TABLE IF NOT EXISTS public.pain_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  body_part TEXT NOT NULL,
  pain_level INTEGER CHECK (pain_level BETWEEN 0 AND 10),
  notes TEXT
);

-- 6. Create Nutrition Logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT,
  calories INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fats_g INTEGER
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Exercises: Everyone authenticated can read
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT TO authenticated USING (true);
-- Exercises: Only admins can insert/update
CREATE POLICY "Admins can manage exercises" ON public.exercises FOR ALL TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Routines: Users manage their own
CREATE POLICY "Users manage own routines" ON public.routines FOR ALL USING (auth.uid() = user_id);

-- Routine Exercises: Users manage through their routines
CREATE POLICY "Users manage own routine exercises" ON public.routine_exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM public.routines r WHERE r.id = routine_id AND r.user_id = auth.uid())
);

-- Pain and Nutrition: Users manage own
CREATE POLICY "Users manage own pain logs" ON public.pain_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own nutrition logs" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id);
