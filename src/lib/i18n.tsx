import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Good morning',
    streak: 'Active Streak',
    routine: 'Daily Vitality Routine',
    home: 'Home',
    progress: 'Progress',
    nutrition: 'Nutrition',
    tips: 'Tips',
    profile: 'Profile',
    admin: 'Admin Portal',
    getStarted: 'Get Started for Free',
    explore: 'Explore Plans',
    users: 'Users',
    exercises: 'Exercises',
    plans: 'Plans',
    aiSettings: 'AI Settings',
  },
  ar: {
    welcome: 'صباح الخير',
    streak: 'سلسلة النشاط',
    routine: 'روتين الحيوية اليومي',
    home: 'الرئيسية',
    progress: 'التقدم',
    nutrition: 'التغذية',
    tips: 'نصائح',
    profile: 'الملف الشخصي',
    admin: 'بوابة الإدارة',
    getStarted: 'ابدأ مجانًا',
    explore: 'استكشف الخطط',
    users: 'المستخدمون',
    exercises: 'التمارين',
    plans: 'الخطط',
    aiSettings: 'إعدادات الذكاء الاصطناعي',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('bekfit_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('bekfit_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string) => translations[lang][key] || key;
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
