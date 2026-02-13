'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dictionaries, Language, Dictionary, languages } from '@/lib/i18n/dictionaries';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    languages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load persisted language from local storage on mount
        const savedLimit = localStorage.getItem('app-language') as Language;
        if (savedLimit && dictionaries[savedLimit]) {
            setLanguageState(savedLimit);
        }
        setIsLoaded(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app-language', lang);
    };

    // Translation function: t('sidebar.dashboard')
    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = dictionaries[language];
        let fallback: any = dictionaries['en'];

        for (const k of keys) {
            if (current && current[k] !== undefined) {
                current = current[k];
            } else {
                current = undefined;
            }

            if (fallback && fallback[k] !== undefined) {
                fallback = fallback[k];
            } else {
                fallback = undefined;
            }
        }

        return current || fallback || key;
    };

    // Avoid hydration mismatch by rendering children only after loading preference (optional, or use default)
    // For dashboard, immediate rendering is fine, we can default to 'en' then switch.

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
