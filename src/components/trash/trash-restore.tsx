'use client'

import React, {useEffect, useState} from 'react';
import {File} from '@/lib/supabase/supabase.types'
import {appFoldersType, useAppState} from "@/lib/providers/state-provider";
import Link from "next/link";
import {FileIcon} from "lucide-react";

const TrashRestore = () => {
    const {state, dispatch, workspaceId} = useAppState()
    const [folders, setFolders] = useState<appFoldersType[] | []>([])
    const [files, setFiles] = useState<File[] | []>([])

    // Fetch local data
    useEffect(() => {
        const stateFolders = state.workspaces
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.filter((folder) => folder.inTrash ) || []
        setFolders(stateFolders);

        let stateFiles: File[] = []
        state.workspaces.find(workspace => workspace.id === workspaceId)
            ?.folders.forEach(folder => {folder.files.forEach((file) => {
                if (file.inTrash) {
                    stateFiles.push(file)
                }
            })})
        setFiles(stateFiles);
    }, [state, workspaceId]);

    return (
        <section>
            {!!folders.length && (
                <>
                    <h3>
                        Folders
                    </h3>
                    {folders.map((folder) => (
                        <Link
                            key={folder.id}
                            href={`/dashboard/${folder.workspaceId}/${folder.id}`}
                            className={'hover:bg-muted rounded-md p-2 flex items-center justify-between'}
                        >
                            <article>
                                <aside className={'flex items-center gap-2'}>
                                    <FileIcon />
                                    {folder.title}
                                </aside>
                            </article>
                        </Link>
                    ))}
                </>
            )}
            {!!files.length && (
                <>
                    <h3>
                        Files
                    </h3>
                    {files.map((file) => (
                        <Link
                            key={file.id}
                            href={`/dashboard/${file.workspaceId}/${file.folderId}/${file.id}`}
                            className={'hover:bg-muted rounded-md p-2 flex items-center justify-between'}
                        >
                            <article>
                                <aside className={'flex items-center gap-2'}>
                                    <FileIcon />
                                    {file.title}
                                </aside>
                            </article>
                        </Link>
                    ))}
                </>
            )}
            {!files.length && !folders.length && (
                <div className={'text-muted-foreground absolute top-[50%] left-[50%] tracking-normal -translate-x-1/2 -translate-y-1/2'}>
                    No items in trash
                </div>
            )}
        </section>
    );
};

export default TrashRestore;


/*TODO: 11:21:29*/