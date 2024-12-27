import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { IPProvider } from "@/app/contexts/ip-context";
import { PreferencesProvider } from "./contexts/preferences-context";
import { UsernameProvider } from "./contexts/username-context";

import "./globals.scss";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<IPProvider>
					<PreferencesProvider>
						<UsernameProvider>
							{children}
						</UsernameProvider>
					</PreferencesProvider>
				</IPProvider>
			</body>
		</html>
	);
}
