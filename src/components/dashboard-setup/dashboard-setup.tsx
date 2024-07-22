'use client'

import React from 'react';
import {AuthUser} from "@supabase/supabase-js";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface DashboardSetupProps {
    user: AuthUser;
    subscription: {} | null
}

const DashboardSetup = ({user, subscription}: DashboardSetupProps) => {
    return (
        <Card className={'w-[800px] h-screen sm:h-auto'}>
            <CardHeader>
                <CardTitle>
                    Create A Workspace
                </CardTitle>
                <CardDescription>
                    Let&apos;s create a private workspace to get you started. You can add collaborators later from the
                    workspace settings tab.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={()=> {}}>
                    <div className={'flex flex-col gap-4'}>
                        <div>

                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default DashboardSetup;