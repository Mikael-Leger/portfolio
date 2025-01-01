"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface IsAnyReducedContextType {
    isAnyReduced: boolean;
    listOfReduced: any;
    addToList: (value: number) => void;
    removeFromList: (value: number) => void;
}

const IsAnyReducedContext = createContext<IsAnyReducedContextType | undefined>(undefined);

export const useIsAnyReduced = (): IsAnyReducedContextType => {
    const context = useContext(IsAnyReducedContext);
    if (!context) {
        throw new Error('useIsAnyReduced must be used within a IsAnyReducedProvider');
    }
    return context;
};

interface IsAnyReducedProviderProps {
    children: ReactNode;
}

export const IsAnyReducedProvider: React.FC<IsAnyReducedProviderProps> = ({ children }) => {
    const [listOfReduced, setListOfReduced] = useState<number[]>([]);

    const addToList = (id: number) => {
        setListOfReduced(prevList => {
            const updatedList = [...prevList];

            if (!updatedList.includes(id)) {
                updatedList.push(id);
            }

            return updatedList;
        });
    }

    const removeFromList = (id: number) => {
        setListOfReduced(prevList => {
            const updatedList = [...prevList];
            const elemIndex = updatedList.findIndex(elem => elem == id);

            if (elemIndex != -1) {
                updatedList.splice(elemIndex, 1);
            }

            return updatedList;
        });
    }

    return (
        <IsAnyReducedContext.Provider value={{ isAnyReduced: listOfReduced.length != 0, listOfReduced, addToList, removeFromList }}>
            {children}
        </IsAnyReducedContext.Provider>
    );
};
