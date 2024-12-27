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
		const fetchUsername = async () => {
			try {
				const response = await fetch('/api/getUsername');

				if (response.status == 200) {
					const data = await response.json();
					setUsername(data.username);
				}

			} catch (e) {
				console.error(`Fetch error: ${e}`);
				setUsername("dev-user");
			}
		};

		fetchUsername();
	}, []);

	return (
		<UsernameContext.Provider value={username}>
			{children}
		</UsernameContext.Provider>
	);
};

export default UsernameContext;
