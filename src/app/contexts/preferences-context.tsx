"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Preferences from '../interfaces/preferences.interface';
import CustomColor from '../interfaces/custom-color.interface';

type PreferencesContextType = Preferences | null;

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
    children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
    const [preferences, setPreferences] = useState<Preferences>();

    useEffect(() => {
        const theme = getPreferredTheme();
        getPreferredColor(theme);
    }, []);

    const getPreferredTheme = () => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "no-preference";
    };

    const getPreferredColor = async (theme: string) => {
        let r, g, b;
        let rShaded, gShaded, bShaded;
        if (theme == "dark") {
            r = 220;
            g = 220;
            b = 220;
            rShaded = 200;
            gShaded = 200;
            bShaded = 200;
        } else {
            r = 20;
            g = 20;
            b = 20;
            rShaded = 40;
            gShaded = 40;
            bShaded = 40;
        }
        setPreferences({
            theme,
            color: {
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                textColor: theme == "dark" ? "white" : "black",
                backgroundShadedColor: `rgb(${rShaded}, ${gShaded}, ${bShaded})`
            }
        });
    };

    return (
        <PreferencesContext.Provider value={preferences}>
            {children}
        </PreferencesContext.Provider>
    );
};

export default PreferencesContext;
