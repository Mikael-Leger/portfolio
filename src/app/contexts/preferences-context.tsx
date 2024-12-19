"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface CustomColor {
    backgroundColor: string;
    textColor: string;
    backgroundShadedColor: string;
}

export interface Preferences {
    theme: string;
    color: CustomColor | undefined;
}

type PreferencesContextType = Preferences | null;

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProps {
    children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProps> = ({ children }) => {
    const [theme, setTheme] = useState("no-preference");
    const [customColor, setCustomColor] = useState<CustomColor>();

    useEffect(() => {
        const theme = getPreferredTheme();
        setTheme(theme);

    }, []);

    useEffect(() => {
        if (theme) {
            getPreferredColor();
        }
    }, [theme]);

    const getPreferredTheme = () => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "no-preference";
    };

    const getPreferredColor = async () => {
        try {
            let r = 0, g = 0, b = 0;
            const response = await fetch('/api/getColorizationColor');

            if (response.status == 200) {
                const data = await response.json();
                r = data.r;
                g = data.g;
                b = data.b;
            } else if (theme == 'dark') {
                r = 33;
                g = 33;
                b = 33;
            } else {
                r = 222;
                g = 222;
                b = 222;
            }

            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            const factorAbs = 30;
            const factor = luminance < 128 ? -factorAbs : factorAbs;

            const rShaded = shadeColorValue(r, factor);
            const gShaded = shadeColorValue(g, factor);
            const bShaded = shadeColorValue(b, factor);

            setCustomColor({
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                textColor: luminance < 128 ? "white" : "black",
                backgroundShadedColor: `rgb(${rShaded}, ${gShaded}, ${bShaded})`
            });

        } catch (error) {
            console.error('Error fetching accent color:', error);
        }
    };

    const shadeColorValue = (colorValue: number, factor: number) => {
        return Math.min(255, Math.max(0, colorValue + factor));
    }

    return (
        <PreferencesContext.Provider value={{ theme: theme, color: customColor }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export default PreferencesContext;
