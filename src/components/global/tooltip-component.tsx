import React from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface TootipProps {
    children: React.ReactNode;
    message: string;
}

const TooltipComponent = ({children, message}: TootipProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {message}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default TooltipComponent;