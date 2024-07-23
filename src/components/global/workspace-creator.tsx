'use client'

import React, {useState} from 'react';
import {User, workspace} from "@/lib/supabase/supabase.types";
import {useSupabaseUser} from "@/lib/providers/supabase-user-provider";
import {useRouter} from "next/navigation";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Lock, Plus, Share} from "lucide-react";
import {Button} from "@/components/ui/button";
import {v4} from "uuid";
import {addCollaborators, createWorkspace} from "@/lib/supabase/queries";
import CollaboratorSearch from "@/components/global/collaborator-search";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useToast} from "@/components/ui/use-toast";


const WorkspaceCreator = () => {
    const {user} = useSupabaseUser()
    const {toast} = useToast()
    const router = useRouter();
    const [permissions, setPermissions] = useState<string>('private');
    const [title, setTitle] = useState<string>('');
    const [collaborators, setCollaborators] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const addCollaborator = (user: User) => {
        setCollaborators([...collaborators, user]);
    }

    const removeCollaborator = (user: User) => {
        setCollaborators(collaborators.filter(c => c.id !== user.id));
    }

    const createItem = async () => {
        setIsLoading(true)
        const uuid = v4()
        if (user?.id) {
            const newWorkspace: workspace = {
                data: null,
                createdAt: new Date().toISOString(),
                iconId: '💼',
                id: uuid,
                inTrash: '',
                title,
                workspaceOwner: user.id,
                logo: null,
                bannerUrl: ''
            }
            if(permissions === 'private') {
                await createWorkspace(newWorkspace)
                toast({
                    title: 'Success',
                    description: `Created ${title} workspace`,
                })
                router.refresh()
            }
            if(permissions === 'shared') {
                await createWorkspace(newWorkspace)
                await addCollaborators(collaborators, uuid)
                toast({
                    title: 'Success',
                    description: `Created ${title} workspace`,
                })
                router.refresh()
            }
        }
        setIsLoading(false)
    }

    return (
        <div className={'flex gap-4 flex-col'}>
            <div>
                <Label
                    htmlFor={'name'}
                    className={'text-sm text-muted-foreground'}
                >
                    Name
                </Label>
                <div className={'flex justify-center items-center gap-2'}>
                    <Input
                        name={'name'}
                        value={title}
                        placeholder={'Workspace Name'}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </div>
            </div>
            <>
                <Label
                    htmlFor={'permissions'}
                    className={'text-sm text-muted-foreground'}
                >
                    Permissions
                </Label>
                <Select
                    onValueChange={(val) => setPermissions(val)}
                    defaultValue={permissions}
                >
                    <SelectTrigger className={'w-full h-26 -mt-3'}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={'private'}>
                                <div className={'p-2 flex gap-4 justify-center items-center truncate'}>
                                    <Lock />
                                    <article className={'text-left flex flex-col'}>
                                        <span>Private</span>
                                        <p>Your workspace is private to you. You can choose to share it later.</p>
                                    </article>
                                </div>
                            </SelectItem>
                            <SelectItem value={'shared'}>
                                <div className={'p-2 flex gap-4 justify-center items-center'}>
                                    <Share />
                                    <article className={'text-left flex flex-col'}>
                                        <span>Share</span>
                                        <p>You can invite collaborators.</p>
                                    </article>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </>
            {permissions === 'shared' && (
                <div>
                    <CollaboratorSearch
                        existingCollaborators={collaborators}
                        getCollaborator={(user) => {
                            addCollaborator(user)
                        }}
                    >
                        <Button
                            type={'button'}
                            className={'text-sm mt-4'}
                        >
                            <Plus />
                            Add Collaborators
                        </Button>
                    </CollaboratorSearch>
                    <div className={'mt-4'}>
                        <span className={'text-sm text-muted-foreground'}>
                            Collaborators {collaborators.length || ''}
                        </span>
                        <ScrollArea className={'h-[120px] overflow-y-scroll w-full rounded-md border border-muted-foreground/20'}>
                            {collaborators.length ? (
                                collaborators.map(collaborator => (
                                    <div
                                        key={collaborator.id}
                                        className={'p-4 flex justify-between items-center'}
                                    >
                                        <div className={'flex gap-4 items-center'}>
                                            <Avatar>
                                                <AvatarImage src={'/avatars/7.png'}/>
                                                <AvatarFallback>CP</AvatarFallback>
                                            </Avatar>
                                            <div className={'text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]'}>
                                                {collaborator.email}
                                            </div>
                                        </div>
                                        <Button
                                            variant={'secondary'}
                                            onClick={() => removeCollaborator(collaborator)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className={'absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center'}>
                                    <span className={'text-muted-foreground text-sm'}>
                                        You have no collaborators.
                                    </span>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            )}
            <Button
                type={'button'}
                disabled={!title || (permissions === 'shared' && collaborators.length === 0) || isLoading}
                variant={'secondary'}
                onClick={createItem}
            >
                Create
            </Button>
        </div>
    );
};

export default WorkspaceCreator;