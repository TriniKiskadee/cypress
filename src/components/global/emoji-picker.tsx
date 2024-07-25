'use client'

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useTheme} from "next-themes";
import Loader from "@/components/global/loader";

interface EmojiPickerProps {
    children: React.ReactNode;
    getValue?: (emoji: string) => void
}

const EmojiPicker = ({children, getValue}: EmojiPickerProps) => {
    const {theme, themes} = useTheme();
    const route = useRouter();
    const Picker = dynamic(() => import('emoji-picker-react'), {
        loading: () => <Loader />
    })
    const onClick = (selectedEmoji: any) => {
        if (getValue) getValue(selectedEmoji.emoji);
    }

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    })
    if (!isMounted) return null

    return (
        <div className={'flex items-center'}>
            <Popover>
                <PopoverTrigger className={'cursor-pointer'}>
                    {children}
                </PopoverTrigger>
                <PopoverContent className={'p-0 border-none'}>
                    <Picker
                        onEmojiClick={onClick}
                        className={'bg-transparent'}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default EmojiPicker;