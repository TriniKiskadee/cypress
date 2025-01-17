'use client'

import React, {useState} from 'react';
import {AuthUser} from "@supabase/supabase-js";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import EmojiPicker from "@/components/global/emoji-picker";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {Subscription, workspace} from "@/lib/supabase/supabase.types";
import {CreateWorkspaceFormSchema} from "@/lib/types";
import {z} from "zod";
import {useToast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation";
import { v4 } from 'uuid'
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {createWorkspace} from "@/lib/supabase/queries";
import {useAppState} from "@/lib/providers/state-provider";
import {Button} from "@/components/ui/button";
import Loader from "@/components/global/loader";

interface DashboardSetupProps {
    user: AuthUser;
    subscription: Subscription | null
}

const DashboardSetup = ({user, subscription}: DashboardSetupProps) => {
    const router = useRouter()
    const {toast} = useToast()
    const { dispatch } = useAppState();
    const [selectedEmoji, setSelectedEmoji] = useState('💼');
    const supabase = createClientComponentClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: {isSubmitting: isLoading, errors}
    } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
        mode: 'onChange',
        defaultValues: {
            logo: '',
            workspaceName: '',
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof CreateWorkspaceFormSchema>> = async (value) => {
        const file = value.logo?.[0]
        let filePath = null
        const workspaceUUID = v4()
        console.log(`Dashboard Setup onSubmit uploaded file: ${file}`);

        if (file) {
            try {
                const {data, error} = await supabase.storage
                    .from('workspace-logo')
                    .upload(`workspaceLogo.${workspaceUUID}`, file, {
                        cacheControl: '3600',
                        upsert: true,
                    })
                if (error) throw new Error('')
                filePath = data.path
            } catch (error) {
                console.error(`dashboardSetup: onSubmit if(file) Error: ${error}`)
                toast({
                    title: 'Error! Could not upload your workspace logo',
                    variant: 'destructive',
                })
            }
        }

        try {
            const newWorkspace: workspace = {
                data: null,
                createdAt: new Date().toISOString(),
                iconId: selectedEmoji,
                id: workspaceUUID,
                inTrash: '',
                title: value.workspaceName,
                workspaceOwner: user.id,
                logo: filePath || null,
                bannerUrl: '',
            }
            const {data, error:createError} = await createWorkspace(newWorkspace)
            if(createError) {
                throw new Error
            }
            dispatch({
                type: 'ADD_WORKSPACE',
                payload: {
                    ...newWorkspace,
                    folders: []
                }
            })

            toast({
                title: 'Workspace Created',
                description: `${newWorkspace.title} had been created successfully.`,
            })

            router.replace(`/dashboard/${newWorkspace.id}`)
        } catch (error) {
            console.log(`dashboardSetup: onSubmit newWorkspace Error: ${error}`)
            toast({
                variant: 'destructive',
                description: `Oops! Something went wrong, and we couldn't create your workspace. Please try again or come back later.`,
            })
        } finally {
            reset()
        }
    }

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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={'flex flex-col gap-4'}>
                        <div className={'flex items-center gap-4'}>
                            <div className={'text-5xl'}>
                                <EmojiPicker
                                    getValue={(emoji) => setSelectedEmoji(emoji)}
                                >
                                    {selectedEmoji}
                                </EmojiPicker>
                            </div>
                            <div className={'w-full'}>
                                <Label
                                    htmlFor={'workspaceName'}
                                    className={'text-sm text-muted-foreground'}
                                >
                                    Name
                                </Label>
                                <Input
                                    id={'workspaceName'}
                                    type={'text'}
                                    placeholder={'Workspace Name'}
                                    className={''}
                                    disabled={isLoading}
                                    {...register('workspaceName', {
                                        required: 'Workspace name is required'
                                    })}
                                />
                                <small className={'text-red-600'}>
                                    {errors?.workspaceName?.message?.toString()}
                                </small>
                            </div>
                        </div>
                        <div>
                            <Label
                                htmlFor={'logo'}
                                className={'text-sm text-muted-foreground'}
                            >
                                Workspace Logo
                            </Label>
                            <Input
                                id={'logo'}
                                type={'file'}
                                accept={'image/*'}
                                placeholder={'Workspace Logo'}
                                className={''}
                                disabled={isLoading || subscription?.status !== 'active'}
                                {...register('logo', {
                                    required: false
                                })}
                            />
                            <small className={'text-red-600'}>
                                {errors?.logo?.message?.toString()}
                            </small>
                            {subscription?.status !== 'active' && (
                                <small
                                    className={'text-muted-foreground block'}
                                >
                                    To customize your workspace, you need to be on a Pro Plan
                                </small>
                            )}
                        </div>
                        <div className="self-end">
                            <Button
                                disabled={isLoading}
                                type="submit"
                            >
                                {!isLoading ? 'Create Workspace' : <Loader />}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default DashboardSetup;