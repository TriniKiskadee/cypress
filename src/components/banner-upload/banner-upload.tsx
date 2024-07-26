import React from 'react';
import {workspace} from "@/lib/supabase/supabase.types";
import CustomDialogTrigger from "@/components/global/custom-dialog-trigger";
import BannerUploadForm from "@/components/banner-upload/banner-upload-form";

interface BannerUploadProps {
    children: React.ReactNode;
    id: string
    dirType: 'workspace' | 'folder' | 'file'
    className: string
}

const BannerUpload = ({children, id, dirType, className}: BannerUploadProps) => {
    return (
        <CustomDialogTrigger
            header={'Upload Banner'}
            content={
                <BannerUploadForm
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