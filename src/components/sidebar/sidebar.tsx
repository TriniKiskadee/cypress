import React from 'react';
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {
    getCollaboratingWorkspaces,
    getFolders,
    getPrivateWorkspaces, getSharedWorkspaces,
    getUserSubscriptionStatus
} from "@/lib/supabase/queries";
import {redirect} from "next/navigation";
import {twMerge} from "tailwind-merge";
import WorkspaceDropdown from "@/components/sidebar/workspace-dropdown";
import PlanUsage from "@/components/sidebar/plan-usage";
import NativeNavigation from "@/components/sidebar/native-navigation";
import {ScrollArea} from "@/components/ui/scroll-area";
import FoldersDropdownList from "@/components/sidebar/folders-dropdown-list";

interface SidebarProps {
    params: {workspaceId: string;}
    className?: string;
}

const Sidebar = async ({params, className}: SidebarProps) => {
    const supabase = createServerComponentClient({cookies})
    // users
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) return

    // subscriptions
    const {data: subscriptionData, error: SubscriptionError} = await getUserSubscriptionStatus(user.id)

    // folders
    const {data: workspaceFolderData, error: FoldersError} = await getFolders(params.workspaceId)

    // errors
    if(SubscriptionError || FoldersError) redirect('/dashboard')

    const [
        privateWorkspaces,
        collaboratingWorkspaces,
        sharedWorkspaces
    ] = await Promise.all([
        getPrivateWorkspaces(user.id),
        getCollaboratingWorkspaces(user.id),
        getSharedWorkspaces(user.id),
    ])


    // all workspaces user is collaborating in
    return (
        <aside className={twMerge('hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
            className
        )}>
            <div>
                <WorkspaceDropdown
                    privateWorkspaces={privateWorkspaces}
                    sharedWorkspaces={sharedWorkspaces}
                    collaboratingWorkspaces={collaboratingWorkspaces}
                    defaultValue={[
                        ...privateWorkspaces,
                        ...sharedWorkspaces,
                        ...collaboratingWorkspaces,
                    ].find(workspace => workspace.id === params.workspaceId)}
                />
                <PlanUsage
                    foldersLength={workspaceFolderData?.length || 0}
                    subscription={subscriptionData}
                />
                <NativeNavigation
                    myWorkspaceId={params.workspaceId}
                />
                <ScrollArea className={'overflow-scroll relative h-[450px]'}>
                    <div className={'pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40'} />

                    <FoldersDropdownList
                        workspaceFolders={workspaceFolderData}
                        workspaceId={params.workspaceId}
                    />
                </ScrollArea>
            </div>
        </aside>
    );
};

export default Sidebar;