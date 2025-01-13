"use client"

import React, { createContext, useContext, useState } from "react";
import { OverflowY } from "../types/overflow";

interface BodyOverflowContextProps {
    overflowY: OverflowY;
    setOverflowY: (value: OverflowY) => void;
}

const BodyOverflowContext = createContext<BodyOverflowContextProps | undefined>(
    undefined
);

export const BodyOverflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [overflowY, setOverflowY] = useState<OverflowY>("auto");

    return (
        <BodyOverflowContext.Provider value={{ overflowY, setOverflowY }}>
            {children}
        </BodyOverflowContext.Provider>
    );
};

export const useBodyOverflow = () => {
    const context = useContext(BodyOverflowContext);
    if (!context) {
        throw new Error("useBodyOverflow must be used within a BodyOverflowProvider");
    }
    return context;
};
