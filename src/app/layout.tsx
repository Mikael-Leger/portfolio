import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { IPProvider } from "@/app/contexts/ip-context";
import { PreferencesProvider } from "./contexts/preferences-context";
import { IsMobileProvider } from "./contexts/mobile-context";
import { UsernameProvider } from "./contexts/username-context";
import { IsAnyReducedProvider } from "./contexts/is-reduced";
import { BodyOverflowProvider } from "./contexts/body-overflow";
import { LanguageProvider } from "./contexts/language-context";
import Body from "./components/body/body";

import "./styles/globals.scss";

export const metadata: Metadata = {
	title: "Mikaël LÉGER - Full-Stack Developer",
	description: "This is my interactive Portfolio."
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<BodyOverflowProvider>
				<Body>
					<IPProvider>
						<LanguageProvider>
							<PreferencesProvider>
								<IsMobileProvider>
									<UsernameProvider>
										<IsAnyReducedProvider>
											{children}
										</IsAnyReducedProvider>
									</UsernameProvider>
								</IsMobileProvider>
							</PreferencesProvider>
						</LanguageProvider>
					</IPProvider>
				</Body>
			</BodyOverflowProvider>
		</html>
	);
}
