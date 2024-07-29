import React, {useEffect} from 'react';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import {useAppState} from "@/lib/providers/state-provider";
import {useRouter} from 'next/navigation'
import {File, Folder, workspace} from '@/lib/supabase/supabase.types'

const useSupabaseRealtime = () => {
    const supabase = createClientComponentClient()
    const {
        dispatch,
        state,
        workspaceId: selectedWorkspace
    } = useAppState();
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel('db-changes')
            // files
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'files'
            },
            async (payload) => {
                if (payload.eventType === 'INSERT') {
                    console.log('RECEIVED REALTIME EVENT')
                    const {
                        folder_id: folderId,
                        workspace_id: workspaceId,
                        id: fileId,
                    } = payload.new
                    if (!state.workspaces
                        .find((workspace) => workspace.id === workspaceId)
                        ?.folders.find((folder) => folder.id === folderId)
                        ?.files.find((file) => file.id === folderId)
                    ) {
                        const newFile: File = {
                            id: payload.new.id,
                            workspaceId: payload.new.workspace_d,
                            folderId: payload.new.folder_id,
                            createdAt: payload.new.created_at,
                            title: payload.new.title,
                            iconId: payload.new.icon_id,
                            data: payload.new.data,
                            inTrash: payload.new.in_trash,
                            bannerUrl: payload.new.banner_url,
                        }
                        dispatch({
                            type: 'ADD_FILE',
                            payload: {
                                file: newFile,
                                folderId,
                                workspaceId
                            }
                        })
                    }
                } else if (payload.eventType === 'DELETE') {
                    let workspaceId = ''
                    let folderId = ''
                    const fileExists = state.workspaces
                        .some((workspace) => {
                            workspace.folders.some((folder) => {
                                folder.files.some((file) => {
                                    if (file.id === payload.old.id) {
                                        workspaceId = workspace.id
                                        folderId = folder.id
                                        return true
                                    }
                                })
                            })
                        })

                    if (fileExists && workspaceId && folderId) {
                        router.replace(`/dashboard/${workspaceId}`)
                        dispatch({
                            type: 'DELETE_FILE',
                            payload: {
                                fileId: payload.old.id,
                                folderId,
                                workspaceId
                            }
                        })
                    }
                } else if (payload.eventType === 'UPDATE') {
                    const {
                        folder_id: folderId,
                        workspace_id: workspaceId,
                    } = payload.new
                    state.workspaces.some((workspace) => {
                        workspace.folders.some((folder) => {
                            folder.files.some((file) => {
                                if (file.id === payload.new.id) {
                                dispatch({
                                    type: 'UPDATE_FILE',
                                    payload: {
                                        file: {
                                            title: payload.new.title,
                                            iconId: payload.new.icon_id,
                                            inTrash: payload.new.in_trash
                                        },
                                        fileId: payload.new.id,
                                        folderId,
                                        workspaceId
                                    }
                                })
                                }
                            })
                        })
                    })
                }
            }).subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [supabase, state, selectedWorkspace]);

    // folders
    useEffect(() => {
        const channel = supabase
            .channel('db-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'folders'
            }, async (payload) => {
                if (payload.eventType === 'INSERT') {
                    console.log('RECEIVED REALTIME EVENT')
                    const {
                        folder_id: folderId,
                        workspace_id: workspaceId,
                    } = payload.new
                    if (!state.workspaces
                        .find((workspace) => workspace.id === workspaceId)
                        ?.folders.find((folder) => folder.id === folderId)
                    ) {
                        const newFolder: Folder = {
                            id: payload.new.id,
                            workspaceId: payload.new.workspace_id,
                            createdAt: payload.new.created_at,
                            title: payload.new.title,
                            iconId: payload.new.icon_id,
                            data: payload.new.data,
                            inTrash: payload.new.in_trash,
                            bannerUrl: payload.new.banner_url,
                        }
                        dispatch({
                            type: 'ADD_FOLDER',
                            payload: {
                                folder: {
                                    ...newFolder,
                                    files: []
                                },
                                workspaceId
                            }
                        })
                    }
                } else if (payload.eventType === 'DELETE') {
                    let workspaceId = ''
                    let folderId = ''
                    const folderExists = state.workspaces
                        .some((workspace) => {
                            workspace.folders.some((folder) => {
                                if (folder.id === payload.old.id) {
                                    workspaceId = workspace.id
                                    return true
                                }
                            })
                        })

                    if (folderExists && workspaceId) {
                        router.replace(`/dashboard/${workspaceId}`)
                        dispatch({
                            type: 'DELETE_FOLDER',
                            payload: {
                                folderId: payload.old.id,
                                workspaceId
                            }
                        })
                    }
                } else if (payload.eventType === 'UPDATE') {
                    const {
                        workspace_id: workspaceId,
                    } = payload.new
                    state.workspaces.some((workspace) => {
                        workspace.folders.some((folder) => {
                            if (folder.id === payload.new.id) {
                                dispatch({
                                    type: 'UPDATE_FOLDER',
                                    payload: {
                                        folder: {
                                            title: payload.new.title,
                                            iconId: payload.new.icon_id,
                                            inTrash: payload.new.in_trash
                                        },
                                        folderId: payload.new.id,
                                        workspaceId
                                    }
                                })
                            }
                        })
                    })
                }
            }).subscribe()
        return () => {
            channel.unsubscribe()
        }
    }, [supabase, state, selectedWorkspace]);

    /*
    // workspaces
    useEffect(() => {
        const channel = supabase
            .channel('db-changes')

            .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'workspaces'
                }, async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        console.log('RECEIVED REALTIME EVENT')
                        const {
                            workspace_id: workspaceId,
                        } = payload.new
                        if (!state.workspaces
                            .find((workspace) => workspace.id === workspaceId)
                        ) {
                            const newWorkspace: workspace = {
                                id: payload.new.id,
                                createdAt: payload.new.created_at,
                                title: payload.new.title,
                                iconId: payload.new.icon_id,
                                data: payload.new.data,
                                inTrash: payload.new.in_trash,
                                bannerUrl: payload.new.banner_url,
                                logo: payload.new.logo,
                                workspaceOwner: payload.new.workspace_owner
                            }
                            dispatch({
                                type: 'ADD_WORKSPACE',
                                payload: {
                                    ...newWorkspace,
                                    folders: []
                                }
                            })
                        }
                    } else if (payload.eventType === 'DELETE') {
                        let workspaceId = ''
                        const folderExists = state.workspaces
                            .some((workspace) => {
                                if (workspace.id === payload.old.id) {
                                    return true
                                }
                            })

                        if (folderExists && workspaceId) {
                            router.replace(`/dashboard/${workspaceId}`)
                            dispatch({
                                type: 'DELETE_FOLDER',
                                payload: {
                                    folderId: payload.old.id,
                                    workspaceId
                                }
                            })
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        const {
                            workspace_id: workspaceId,
                        } = payload.new
                        state.workspaces.some((workspace) => {
                            workspace.folders.some((folder) => {
                                if (folder.id === payload.new.id) {
                                    dispatch({
                                        type: 'UPDATE_FOLDER',
                                        payload: {
                                            folder: {
                                                title: payload.new.title,
                                                iconId: payload.new.icon_id,
                                                inTrash: payload.new.in_trash
                                            },
                                            folderId: payload.new.id,
                                            workspaceId
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
            ).subscribe()
        return () => {
            channel.unsubscribe()
        }
    }, [supabase, state, selectedWorkspace])*/

    return null
};

export default useSupabaseRealtime;