import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';

interface AISupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function AISupportModal({ isOpen, onClose, user }: AISupportModalProps) {
  const [problem, setProblem] = useState('');
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const { getToken } = useAuth();

  const handleDraftAI = async () => {
    if (!problem.trim()) return;
    
    setIsDrafting(true);
    try {
      const token = await getToken();
      setApiToken(token);
      
      const response = await api.post('/api/ai/draft-ticket', {
        userProblem: problem,
        userContext: {
          userName: user.fullName,
          userRole: user.role,
          lastActive: user.updatedAt
        }
      });
      
      setDraft(response.data.draft);
    } catch (error) {
      console.error('AI Drafting failed:', error);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="size-5 text-primary" />
            </div>
            <DialogTitle>AI Support Agent</DialogTitle>
          </div>
          <DialogDescription>
            Draft a professional response for <strong>{user?.fullName}</strong> using GPT-4.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">User Problem Description</label>
            <Textarea 
              placeholder="Describe the user's issue here..."
              className="bg-black/20 border-white/10 min-h-[100px]"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleDraftAI} 
              disabled={isDrafting || !problem.trim()}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              {isDrafting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate AI Draft
            </Button>
          </div>

          {draft && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-2">
                <Bot className="size-4" />
                AI Suggested Response
              </label>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm leading-relaxed text-white/90">
                {draft}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/10">Cancel</Button>
          <Button disabled={!draft} className="gap-2">
            <Send className="size-4" />
            Use this Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
