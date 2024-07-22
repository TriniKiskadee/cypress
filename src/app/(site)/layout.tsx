import React from 'react';
import Header from "@/components/landing-page/header";

interface HomePageLayoutProps {
    children: React.ReactNode;
}

const HomePageLayout = ({children}: HomePageLayoutProps) => {
    return (
        <main>
            <Header />
            {children}
        </main>
    );
};

export default HomePageLayout;