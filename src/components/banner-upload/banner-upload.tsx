import React from 'react';
import {appFoldersType, appWorkspacesType} from "@/lib/providers/state-provider";
import {Folder, workspace} from "@/lib/supabase/supabase.types";
import CustomDialogTrigger from "@/components/global/custom-dialog-trigger";
import header from "@/components/landing-page/header";
import BannerUploadForm from "@/components/banner-upload/banner-upload-form";

interface BannerUploadProps {
    children: React.ReactNode;
    details: appWorkspacesType | appFoldersType | File | workspace | Folder
    id: string
    dirType: 'workspace' | 'folder' | 'file'
    className: string
}

const BannerUpload = ({children, details, id, dirType, className}: BannerUploadProps) => {
    return (
        <CustomDialogTrigger
            header={'Upload Banner'}
            content={
                <BannerUploadForm
                    details={details}
                    dirType={dirType}
                    id={id}
                />
            }
            className={className}
        >
            {children}
        </CustomDialogTrigger>
    );
};

export default BannerUpload;