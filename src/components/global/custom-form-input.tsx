import React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control, FieldPath} from "react-hook-form";
import {z} from "zod";
import {FormSchema} from "@/lib/types";

const formSchema = FormSchema('sign-up')

interface CustomFormInputProps {
    isLoading: boolean
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string
}


const CustomFormInput = ({isLoading, control, name, label, placeholder}: CustomFormInputProps) => {
    return (
        <FormField
            disabled={isLoading}
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={(name === 'password' || name === 'confirmPassword') ? 'password' : 'text'}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export default CustomFormInput;