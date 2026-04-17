import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      title="Toggle Theme"
    >
      {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-primary" />}
    </button>
  );
}
