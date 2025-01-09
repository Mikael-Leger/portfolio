"use client"

import React, { createContext, useState, useEffect, ReactNode } from 'react';

type UsernameContextType = string | null;

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

interface UsernameProviderProps {
	children: ReactNode;
}

export const UsernameProvider: React.FC<UsernameProviderProps> = ({ children }) => {
	const [username, setUsername] = useState<UsernameContextType>(null);

	useEffect(() => {
		setUsername("dev-user");
	}, []);

	return (
		<UsernameContext.Provider value={username}>
			{children}
		</UsernameContext.Provider>
	);
};

export default UsernameContext;
