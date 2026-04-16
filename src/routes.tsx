import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { AppLayout } from "./components/layouts/AppLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { AISettings } from "./pages/admin/AISettings";
import { ExerciseLibrary } from "./pages/admin/ExerciseLibrary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "routines", element: <Dashboard /> },
      { path: "progress", element: <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-bold">Progress Analytics Coming Soon</div> },
      { path: "nutrition", element: <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-bold">Nutrition Tracking Coming Soon</div> },
      { path: "tips", element: <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-bold">Daily Vitality Tips Coming Soon</div> },
      { path: "profile", element: <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-bold">Profile Settings Coming Soon</div> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <UserManagement /> },
      { path: "exercises", element: <ExerciseLibrary /> },
      { path: "plans", element: <div className="p-8 text-center text-muted-foreground uppercase tracking-widest font-bold">Coach Plan Builder Coming Soon</div> },
      { path: "ai-settings", element: <AISettings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
