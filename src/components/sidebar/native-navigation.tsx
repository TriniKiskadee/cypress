import React from 'react';
import {twMerge} from "tailwind-merge";
import Link from "next/link";
import CypressHomeIcon from "@/components/icons/cypressHomeIcon";
import CypressSettingsIcon from "@/components/icons/cypressSettingsIcon";
import CypressTrashIcon from "@/components/icons/cypressTrashIcon";

interface NativeNavigationProps {
    myWorkspaceId: string;
    className?: string;
    getSelectedElement?: (element: string) => void;
}

const NativeNavigation = ({myWorkspaceId, className, getSelectedElement}: NativeNavigationProps) => {
    return (
        <nav className={twMerge('my-2', className)}>
            <ul className={'flex flex-col gap-2'}>
                <li>
                    <Link
                        href={`/dashboard/${myWorkspaceId}`}
                        className={'group/native flex text-Neutrals/neutrals-7 transition-all gap-2'}
                    >
                        <CypressHomeIcon/>
                        <span>My Workspace</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/dashboard/${myWorkspaceId}`}
                        className={'group/native flex text-Neutrals/neutrals-7 transition-all gap-2'}
                    >
                        <CypressSettingsIcon />
                        <span>Settings</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={`/dashboard/${myWorkspaceId}`}
                        className={'group/native flex text-Neutrals/neutrals-7 transition-all gap-2'}
                    >
                        <CypressTrashIcon />
                        <span>Trash</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NativeNavigation;