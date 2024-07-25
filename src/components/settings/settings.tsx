import React from 'react';
import CustomDialogTrigger from "@/components/global/custom-dialog-trigger";
import SettingsForm from "@/components/settings/settings-form";

interface SettingsProps {
    children: React.ReactNode;
}

const Settings = ({children}:SettingsProps) => {
    return (
        <CustomDialogTrigger
            header={'Settings'}
            content={<SettingsForm />}
        >
            {children}
        </CustomDialogTrigger>
    );
};

export default Settings;