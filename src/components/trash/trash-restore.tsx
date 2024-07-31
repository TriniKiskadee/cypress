import React, {useEffect, useState} from 'react';
import {appFoldersType, useAppState} from "@/lib/providers/state-provider";

const TrashRestore = () => {
    const {state, dispatch, workspaceId, folderId} = useAppState()
    const [folders, setFolders] = useState<appFoldersType[] | []>([])
    const [files, setFiles] = useState<File[] | []>([])

    // Fetch local data
    useEffect(() => {

    }, [state]);

    return (
        <div>
            
        </div>
    );
};

export default TrashRestore;