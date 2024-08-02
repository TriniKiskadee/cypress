import React from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import type {Metadata} from "next";

interface LayoutProps {
    children: React.ReactNode;
    params: any
}


const WorkspaceLayout = ({children, params}: LayoutProps) => {
    return (
        <main className={'flex overflow-hidden h-screen w-screen no-scrollbar'}>
            <Sidebar params={params} />

            <MobileSidebar>
                <Sidebar
                    params={params}
                    className="w-screen inline-block sm:hidden"
                />
            </MobileSidebar>

            <div className={'dark:border-Neutrals-12/70 border-l-[1px] w-full relative overflow-scroll no-scrollbar'}>
                {children}
            </div>
        </main>
    );
};

export default WorkspaceLayout;