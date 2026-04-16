import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: "Fitness Goals",
    description: "What are you trying to achieve?",
    field: "goals",
    options: ["Build Muscle", "Improve Mobility", "Weight Loss", "Reduce Pain", "Better Posture"]
  },
  {
    title: "Experience Level",
    description: "Your background in fitness",
    field: "level",
    options: ["Beginner", "Intermediate", "Advanced"]
  },
  {
    title: "Lifestyle",
    description: "Daily habits matter",
    field: "habits",
    options: ["Sitting 8+ hours", "Stand all day", "Moderately active", "Athletic"]
  },
  {
    title: "Equipment",
    description: "What do you have access to?",
    field: "equipment",
    options: ["Full Gym", "Dumbbells Only", "Bodyweight", "Resistance Bands"]
  }
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleToggle = (field: string, option: string) => {
    setSelections(prev => {
      const current = prev[field] || [];
      if (current.includes(option)) {
        return { ...prev, [field]: current.filter(o => o !== option) };
      }
      return { ...prev, [field]: [...current, option] };
    });
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generatePlan();
    }
  };

  const generatePlan = () => {
    setIsGenerating(true);
    // Simulate AI Generation (Story 1.3)
    setTimeout(() => {
      navigate('/app');
    }, 2500);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8 p-4">
        <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <Sparkles className="size-12 text-primary animate-spin-slow" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Synthesizing Your Plan</h2>
          <p className="text-muted-foreground">OpenAI GPT-4 is analyzing your profile...</p>
        </div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <Card className="glass border-primary/20">
          <CardHeader className="text-center">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Step {currentStep + 1} of {steps.length}</div>
            <CardTitle className="text-4xl font-bold">{step.title}</CardTitle>
            <CardDescription className="text-lg">{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {step.options.map((option) => {
                const isSelected = (selections[step.field] || []).includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleToggle(step.field, option)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all duration-200 text-left group relative",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-white/5 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("text-lg font-medium", isSelected ? "text-primary" : "text-white")}>
                        {option}
                      </span>
                      {isSelected && <Check className="size-5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-12">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="text-muted-foreground"
              >
                <ChevronLeft className="size-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={next}
                disabled={(selections[step.field] || []).length === 0}
                className="px-8 shadow-xl shadow-primary/20"
              >
                {currentStep === steps.length - 1 ? "Generate My Plan" : "Continue"}
                <ChevronRight className="size-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
