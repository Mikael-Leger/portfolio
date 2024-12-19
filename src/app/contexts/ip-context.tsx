"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type IPContextType = string | null;

const IPContext = createContext<IPContextType | undefined>(undefined);

interface IPProviderProps {
  children: ReactNode;
}

export const IPProvider: React.FC<IPProviderProps> = ({ children }) => {
  const [ip, setIp] = useState<IPContextType>(null);

  useEffect(() => {
    const fetchIP = async () => {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIp(data.ip);
    };

    fetchIP();
  }, []);

  return (
    <IPContext.Provider value={ip}>
      {children}
    </IPContext.Provider>
  );
};

export default IPContext;
