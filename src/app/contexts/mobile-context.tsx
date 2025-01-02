"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface IsMobileContextType {
    isMobile: boolean;
}

const IsMobileContext = createContext<IsMobileContextType | undefined>(undefined);

export const useIsMobile = (): IsMobileContextType => {
    const context = useContext(IsMobileContext);
    if (!context) {
        throw new Error('useIsMobile must be used within a IsMobileProvider');
    }
    return context;
};

interface IsMobileProviderProps {
    children: ReactNode;
}

export const IsMobileProvider: React.FC<IsMobileProviderProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.outerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <IsMobileContext.Provider value={{ isMobile }}>
            {children}
        </IsMobileContext.Provider>
    );
};
