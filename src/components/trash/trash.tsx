import React from 'react';
import CustomDialogTrigger from "@/components/global/custom-dialog-trigger";
import TrashRestore from "@/components/trash/trash-restore";

interface TrashProps {
    children: React.ReactNode;
}

const Trash = ({children}: TrashProps) => {
    return (
        <CustomDialogTrigger
            header={'Trash'}
            content={<TrashRestore />}
        >
            {children}
        </CustomDialogTrigger>
    );
};

export default Trash;