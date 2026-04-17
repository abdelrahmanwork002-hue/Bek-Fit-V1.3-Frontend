import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Bot, Sparkles, Send, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';

interface AISupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; fullName?: string } | null;
}

export function AISupportModal({ isOpen, onClose, user }: AISupportModalProps) {
  const [problem, setProblem] = useState('');
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const handleDraft = async () => {
    if (!problem.trim() || !user) return;
    setIsDrafting(true);
    setError('');
    try {
      const token = await getToken();
      setApiToken(token);
      const response = await api.post('/api/ai/draft-ticket', {
        userId: user.id,
        userProblem: problem,
      });
      setDraft(response.data.draft);
    } catch {
      setError('Failed to generate draft. Please try again.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleClose = () => {
    setProblem('');
    setDraft('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-white">AI Support Agent</h2>
              <p className="text-xs text-muted-foreground">Drafting for {user?.fullName ?? 'user'}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
              Describe the user's problem
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none min-h-[100px]"
              placeholder="e.g. User is reporting pain in left shoulder after completing session 3..."
              value={problem}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProblem(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {draft && (
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Bot className="size-3" /> AI Draft
              </p>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{draft}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <button onClick={handleClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
            Cancel
          </button>
          {draft && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors">
              <Send className="size-4" /> Use Draft
            </button>
          )}
          <button
            onClick={handleDraft}
            disabled={isDrafting || !problem.trim()}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
          >
            {isDrafting ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {isDrafting ? 'Generating...' : 'Generate Draft'}
          </button>
        </div>
      </div>
    </div>
  );
}
