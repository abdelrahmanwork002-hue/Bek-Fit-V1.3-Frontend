import { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
      title="Toggle Language"
    >
      <Globe className="size-4 text-primary" />
      <span className="text-xs font-bold uppercase tracking-wider">{lang === 'en' ? 'AR' : 'EN'}</span>
    </button>
  );
}
