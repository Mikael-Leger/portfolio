import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IPProvider } from "@/app/contexts/ip-context";

import "./globals.scss";
import { PreferencesProvider } from "./contexts/preferences-context";

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
            {children}
          </PreferencesProvider>
        </IPProvider>
      </body>
    </html>
  );
}
