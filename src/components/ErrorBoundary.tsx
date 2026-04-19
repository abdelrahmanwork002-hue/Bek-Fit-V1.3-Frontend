import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw, ChevronLeft } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 text-center animate-in fade-in duration-500">
          <Card className="glass max-w-md border-rose-500/20 shadow-2xl shadow-rose-500/10">
            <CardHeader>
               <div className="size-20 rounded-[30px] bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                  <ShieldAlert className="size-10 text-rose-500" />
               </div>
               <CardTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">System Breach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The AI Vitality Engine encountered a biomechanical exception. 
                Don't worry, your progress is still synced.
              </p>
              <div className="flex flex-col gap-3">
                 <Button 
                   onClick={() => window.location.reload()}
                   className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl"
                 >
                   <RefreshCw className="size-4 mr-2" /> Re-sync Reality
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={() => window.location.href = '/app'}
                   className="text-xs text-muted-foreground hover:text-white"
                 >
                   <ChevronLeft className="size-3 mr-2" /> Back to Dashboard
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.children;
  }
}
