"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Preferences from '../interfaces/preferences.interface';

type PreferencesContextType = Preferences | null;

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

interface PreferencesProviderProps {
    children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
    const [preferences, setPreferences] = useState<Preferences>();

    useEffect(() => {
        const theme = getPreferredTheme();
        const browser = getBrowserIconPath()
        const os = getOs();
        getPreferredColor(theme, browser, os);
    }, []);

    const getPreferredTheme = () => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "no-preference";
    };

    const getPreferredColor = async (theme: string, browser: string, os: string) => {
        let r, g, b;
        let rShaded, gShaded, bShaded;
        if (theme == "light") {
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
            },
            browser,
            os
        });
    };

    const getBrowserIconPath = () => {
        const userAgent = navigator.userAgent.toLowerCase();

        const basePath = "/browsers";
        const extension = ".png";

        if ((userAgent.includes("chrome") || userAgent.includes("crios")) && !userAgent.includes("edg")) return `${basePath}/chrome${extension}`;
        if (userAgent.includes("firefox")) return `${basePath}/firefox${extension}`;
        if (userAgent.includes("safari") && !userAgent.includes("chrome") && !userAgent.includes("crios")) return `${basePath}/safari${extension}`;
        if (userAgent.includes("edg")) return `${basePath}/edge${extension}`;
        if (userAgent.includes("opera") || userAgent.includes("opr")) return `${basePath}/opera${extension}`;

        return `${basePath}/chrome${extension}`;
    };

    const getOs = () => {
        const userAgent = window.navigator.userAgent;

        if (userAgent.includes("Win")) {
            return "windows";
        } else if (userAgent.includes("Mac")) {
            return "macos";
        } else {
            return "other";
        }
    }

    return (
        <PreferencesContext.Provider value={preferences}>
            {children}
        </PreferencesContext.Provider>
    );
};

export default PreferencesContext;
