import type {Metadata} from "next";
import {DM_Sans} from 'next/font/google'
import {twMerge} from "tailwind-merge";
import {ThemeProvider} from "@/lib/providers/next-theme-provider";
import {Toaster} from "@/components/ui/toaster";
import AppStateProvider from "@/lib/providers/state-provider";
import {SupabaseUserProvider} from "@/lib/providers/supabase-user-provider";
import {SocketProvider} from "@/lib/providers/socket-provider";
import "@/app/globals.css";

export const dynamic = 'force-dynamic'

const inter = DM_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
    title: {
        default: 'Cypress',
        template: '%s | Cypress',
    },
    description: 'All-In-One Collaboration and Productivity Platform',
    openGraph: {
        title: 'Cypress',
        description: 'All-In-One Collaboration and Productivity Platform',
        type: 'website',
        locale: 'en_US',
        //url: '',
        siteName: 'Cypress',
        images: 'public/BannerImage.png',
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={twMerge('bg-background', inter.className)}>
                <ThemeProvider
                    attribute={'class'}
                    defaultTheme={'system'}
                    enableSystem
                >
                    <AppStateProvider>
                        <SupabaseUserProvider>
                            <SocketProvider>
                                {children}
                                <Toaster/>
                            </SocketProvider>
                        </SupabaseUserProvider>
                    </AppStateProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
