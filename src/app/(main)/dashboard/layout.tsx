import React from 'react';
import {SubscriptionModalProvider} from "@/lib/providers/subscription-modal-provider";

interface LayoutProps {
    children: React.ReactNode;
    params: any
}

const MainLayout = ({children, params}: LayoutProps) => {
    return (
        <main className={'flex overflow-hidden h-screen'}>
            <SubscriptionModalProvider>
                {children}
            </SubscriptionModalProvider>
        </main>
    );
};

export default MainLayout;