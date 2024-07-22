import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/lib/providers/next-theme-provider";
import {DM_Sans} from 'next/font/google'
import {twMerge} from "tailwind-merge";

const inter = DM_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Cypress",
    description: "All-In-One Collaboration and Productivity Platform\n" +
        "Application Banner",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={twMerge('bg-background', inter.className)}>
                <ThemeProvider
                    attribute={'class'}
                    defaultTheme={'dark'}
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
