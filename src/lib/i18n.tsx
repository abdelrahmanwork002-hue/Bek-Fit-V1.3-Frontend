import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Good morning, John',
    streak: 'Active Streak',
    routine: 'Daily Vitality Routine',
    dashboard: 'Dashboard',
    progress: 'Progress',
    nutrition: 'Nutrition',
    tips: 'Tips',
    profile: 'Profile',
    admin: 'Admin Portal',
    getStarted: 'Get Started for Free',
    explore: 'Explore Plans',
  },
  ar: {
    welcome: 'صباح الخير يا جون',
    streak: 'سلسلة النشاط',
    routine: 'روتين الحيوية اليومي',
    dashboard: 'لوحة التحكم',
    progress: 'التقدم',
    nutrition: 'التغذية',
    tips: 'نصائح',
    profile: 'الملف الشخصي',
    admin: 'بوابة الإدارة',
    getStarted: 'ابدأ مجانًا',
    explore: 'استكشف الخطط',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
