import React from 'react';
import {appFoldersType, appWorkspacesType, useAppState} from "@/lib/providers/state-provider";
import {Folder, workspace} from "@/lib/supabase/supabase.types";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateWorkspaceFormSchema, UploadBannerFormSchema} from "@/lib/types";
import {z} from "zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Loader from "@/components/global/loader";
import {useToast} from "@/components/ui/use-toast";
import {updateFile, updateFolder, updateWorkspace} from "@/lib/supabase/queries";

interface BannerUploadFormProps {
    dirType: 'workspace' | 'folder' | 'file'
    details: appWorkspacesType | appFoldersType | File | workspace | Folder
    id: string
}

const BannerUploadForm = ({dirType, details, id}: BannerUploadFormProps) => {
    const supabase = createClientComponentClient()
    const  {state, workspaceId, folderId, dispatch} = useAppState()

    const {
        register,
        handleSubmit,
        reset,
        formState: {isSubmitting: isUploading, errors},
    } = useForm<z.infer<typeof UploadBannerFormSchema>>({
        mode: 'onChange',
        defaultValues: {
            banner: ''
        }
    })

    const onSubmitHandler: SubmitHandler<z.infer<typeof UploadBannerFormSchema>> = async (values) => {
        const file = values.banner?.[0]
        if (!file || !id) return
        try {
            let filePath = null
            const uploadBanner = async () => {
                const {data, error} = await supabase.storage
                    .from('file-banners')
                    .upload(`banner-${id}`, file, {
                        cacheControl: '5',
                        upsert: true,
                    })

                if (error) throw new Error()
                filePath = data.path
            }

            if (dirType === 'file') {
                if (!workspaceId || !folderId) return
                await uploadBanner()

                dispatch({
                    type: 'UPDATE_FILE',
                    payload: {
                        file: {
                            bannerUrl: filePath
                        },
                        fileId: id,
                        folderId,
                        workspaceId
                    }
                })
                await updateFile({ bannerUrl: filePath }, id)
            } else if (dirType === 'folder') {
                if (!workspaceId || !folderId) return
                await uploadBanner()

                dispatch({
                    type: 'UPDATE_FOLDER',
                    payload: {
                        folder: {
                            bannerUrl: filePath
                        },
                        folderId: id,
                        workspaceId
                    }
                })
                await updateFolder({bannerUrl: filePath}, id)
            } else if (dirType === 'workspace') {
                if (!workspaceId) return
                await uploadBanner()

                dispatch({
                    type: 'UPDATE_WORKSPACE',
                    payload: {
                        workspace: {
                            bannerUrl: filePath
                        },
                        workspaceId: id
                    }
                })
                await updateWorkspace({bannerUrl: filePath}, id)
            }
        } catch (error: any) {

        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className={'flex flex-col gap-2'}
        >
            <Label
                className={'text-sm text-muted-foreground'}
                htmlFor={'bannerImage'}
            >
                Banner Image
            </Label>
            <Input
                id={'bannerImage'}
                type={'file'}
                accept={'image/*'}
                disabled={isUploading}
                {...register('banner', {required: 'Banner Image is required'})}
            />
            <small className={'text-red-600'}>
                {errors.banner?.message?.toString()}
            </small>
            <Button
                disabled={isUploading}
                type={'submit'}
            >
                {!isUploading ? 'Upload Banner' : <Loader />}
            </Button>
        </form>
    );
};

export default BannerUploadForm;