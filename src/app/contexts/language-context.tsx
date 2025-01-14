"use client"

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

import languagesTexts from "@/app/data/languages_texts.json";
import { TextByLanguage } from '../types/language';

export type LanguageType = "en" | "baguette";

interface LanguageContextType {
    language: LanguageType;
    setLanguage: (value: LanguageType) => void;
    getTextByComponent: (component: string, index: number) => string;
    getTextsByComponent: (component: string) => TextByLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<LanguageType>("en");

    useEffect(() => {
        const localLanguage = localStorage.getItem("lang") as LanguageType;
        if (localLanguage != null) {
            setLanguage(localLanguage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("lang", language);
    }, [language]);

    const getTextByComponent = (component: string, index: number) => {
        const textsByComponent = languagesTexts.find(languagesText => languagesText.component === component);
        if (!textsByComponent) {
            return "";
        }

        const text = textsByComponent.texts[index][language];
        index++;
        return text;
    }

    const getTextsByComponent = (component: string) => {
        const textsByComponent = languagesTexts.find(languagesText => languagesText.component === component);
        if (!textsByComponent) {
            return [];
        }

        return textsByComponent.texts;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, getTextByComponent, getTextsByComponent }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
