import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
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
        userId: user.id,
        userProblem: problem,
      });
      
      setDraft(response.data.draft);
    } catch (error) {
      console.error('AI Drafting failed:', error);
    } finally {
      setIsDrafting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[600px] glass border border-white/10 rounded-xl p-6 shadow-2xl relative">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Support Agent</h2>
          </div>
          <p className="text-sm text-gray-400">
            Draft a professional response for <strong className="text-white">{user?.fullName}</strong> using GPT-4.
          </p>
        </div>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">User Problem Description</label>
            <textarea 
              placeholder="Describe the user's issue here..."
              className="w-full bg-black/20 border border-white/10 min-h-[100px] rounded-md p-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              value={problem}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProblem(e.target.value)}
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

        <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="border-white/20 text-gray-300 hover:text-white">Cancel</Button>
          <Button disabled={!draft} className="gap-2">
            <Send className="size-4" />
            Use this Response
          </Button>
        </div>
      </div>
    </div>
  );
}
