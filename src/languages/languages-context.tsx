import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations.json';

interface LanguageContextProps {
    language: keyof typeof translations; // Agora 'language' é uma das chaves válidas de 'translations'
    setLanguage: (language: keyof typeof translations) => void; // Ajustamos aqui também
    translations: typeof translations;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<keyof typeof translations>(localStorage.getItem('language') as keyof typeof translations || 'pt');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextProps => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
