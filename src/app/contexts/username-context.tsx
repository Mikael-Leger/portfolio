"use client"

import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';

import { useLanguage } from './language-context';

type UsernameContextType = string | null;

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

interface UsernameProviderProps {
	children: ReactNode;
}

export const UsernameProvider: React.FC<UsernameProviderProps> = ({ children }) => {
	const [username, setUsername] = useState<UsernameContextType>(null);

	useEffect(() => {
		setUsername("unicorn-love");
	}, []);

	return (
		<UsernameContext.Provider value={username}>
			{children}
		</UsernameContext.Provider>
	);
};

export default UsernameContext;
