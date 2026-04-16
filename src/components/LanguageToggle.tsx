import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 font-bold"
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
    >
      <Languages className="size-4" />
      <span>{lang === 'en' ? 'AR' : 'EN'}</span>
    </Button>
  );
}
