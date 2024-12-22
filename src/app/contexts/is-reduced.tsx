import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IsReducedContextType {
    isReduced: boolean;
    setIsReduced: (value: boolean) => void;
}

const IsReducedContext = createContext<IsReducedContextType | undefined>(undefined);

export const useIsReduced = (): IsReducedContextType => {
    const context = useContext(IsReducedContext);
    if (!context) {
        throw new Error('useIsReduced must be used within a IsReducedProvider');
    }
    return context;
};

interface IsReducedProviderProps {
    children: ReactNode;
}

export const IsReducedProvider: React.FC<IsReducedProviderProps> = ({ children }) => {
    const [isReduced, setIsReduced] = useState<boolean>(false);

    return (
        <IsReducedContext.Provider value={{ isReduced, setIsReduced }}>
            {children}
        </IsReducedContext.Provider>
    );
};
