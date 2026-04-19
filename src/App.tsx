import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './lib/i18n';
import { Toaster } from 'sonner';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

// If the key is missing, render a config warning screen instead of crashing
if (!PUBLISHABLE_KEY) {
  console.error('[BekFit] VITE_CLERK_PUBLISHABLE_KEY is not set. Please add it to your .env file.');
}

function App() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-[#0F1115] flex items-center justify-center text-white">
        <div className="text-center space-y-4 p-8">
          <div className="text-4xl">⚙️</div>
          <h1 className="text-2xl font-bold">Configuration Required</h1>
          <p className="text-gray-400 max-w-md">
            Please set <code className="bg-white/10 px-2 py-1 rounded text-primary">VITE_CLERK_PUBLISHABLE_KEY</code> in your environment variables to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" theme="dark" />
        </LanguageProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
