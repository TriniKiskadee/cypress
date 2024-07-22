import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    params: any
}

const MainLayout = ({children, params}: LayoutProps) => {
    return (
        <main className={'flex overflow-hidden h-screen'}>
            {children}
        </main>
    );
};

export default MainLayout;