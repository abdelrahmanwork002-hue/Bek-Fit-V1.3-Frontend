import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Progress } from './pages/Progress';
import { Nutrition } from './pages/Nutrition';
import { Insights } from './pages/Insights';
import { AppLayout } from './components/layouts/AppLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AISettings } from './pages/admin/AISettings';
import { ExerciseLibrary } from './pages/admin/ExerciseLibrary';
import CoachPlanBuilder from './pages/admin/CoachPlanBuilder';

const ComingSoon = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center h-64">
    <p className="text-muted-foreground uppercase tracking-widest font-bold text-sm">{label} — Coming Soon</p>
  </div>
);

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/onboarding', element: <Onboarding /> },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'routines', element: <Dashboard /> },
      { path: 'progress', element: <Progress /> },
      { path: 'nutrition', element: <Nutrition /> },
      { path: 'insights', element: <Insights /> },
      { path: 'tips', element: <ComingSoon label="Daily Vitality Tips" /> },
      { path: 'profile', element: <ComingSoon label="Profile Settings" /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'exercises', element: <ExerciseLibrary /> },
      { path: 'plans', element: <CoachPlanBuilder /> },
      { path: 'ai-settings', element: <AISettings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
