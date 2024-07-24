import React from 'react';
import Dropdown from "@/components/sidebar/dropdown";
import {File} from '@/lib/supabase/supabase.types'

interface SidebarFileProps {
    file: File;
    customFileId: string;
}

const SidebarFile = ({file, customFileId}: SidebarFileProps) => {
    return (
        <Dropdown
            key={file.id}
            title={file.title}
            listType='file'
            id={customFileId}
            iconId={file.iconId}
        />
    );
};

export default SidebarFile;