'use client'

import React, {useMemo, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import clsx from "clsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {FormSchema} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {actionLoginUser, actionSignUpUser} from "@/lib/server-actions/auth-actions";
import Link from "next/link";
import Image from "next/image";
import {Form, FormDescription, FormMessage} from "@/components/ui/form";
import CustomFormInput from "@/components/global/custom-form-input";
import {Button} from "@/components/ui/button";
import Loader from "@/components/global/loader";
import Logo from "../../../public/cypresslogo.svg";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {MailCheck} from "lucide-react";

const AuthForm = ({type}: { type: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitError, setSubmitError] = useState<string>('');
    const [confirmation, setConfirmation] = useState<boolean>(false);


    const codeExchangeError = useMemo(() => {
        if (!searchParams) return '';
        return searchParams.get('error_description');
    }, [searchParams]);

    const confirmationAndErrorStyles = useMemo(
        () => clsx('bg-primary', {
            'bg-red-500/10': codeExchangeError,
            'border-red-500/50': codeExchangeError,
            'text-blue-700': codeExchangeError,
        }),
        [codeExchangeError]
    );

    const formSchema = FormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const {email, password} = data;
        try {
            if (type === 'sign-up') {
                const {error} = await actionSignUpUser({email, password});
                if (error) {
                    setSubmitError(error.message);
                    console.log(`actionSignUpUser ERROR: ${submitError}`)
                    form.reset();
                    return;
                }
                setConfirmation(true);
            }
            if (type === 'login') {
                const {error} = await actionLoginUser(data);
                if (error) {
                    form.reset();
                    setSubmitError(error.message);
                }
                router.replace('/dashboard');
            }
        } catch (error) {
            console.log(`onSubmit Error: ${error}`);
        }
    };

    return (
        <Form {...form}>
            {type === 'login' ? (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={() => {
                        if (submitError) setSubmitError('')
                    }}
                    className={'w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'}
                >
                    <Link
                        href={'/'}
                        className={'w-full flex justify-left items-center'}
                    >
                        <Image
                            src={'cypresslogo.svg'}
                            alt={'cypress logo'}
                            width={50}
                            height={50}
                        />
                        <span className={'font-semibold dark:text-white text-4xl ml-2'}>
                        cypress.
                    </span>
                    </Link>
                    <FormDescription className={'text-foreground/60'}>
                        An All-In-One Collaboration and Productivity Platform
                    </FormDescription>
                    <CustomFormInput
                        isLoading={isLoading}
                        control={form.control}
                        name={'email'}
                        label={'Email'}
                        placeholder={'email'}
                    />
                    <CustomFormInput
                        isLoading={isLoading}
                        control={form.control}
                        name={'password'}
                        label={'Password'}
                        placeholder={'password'}
                    />
                    {submitError && (
                        <FormMessage>{submitError}</FormMessage>
                    )}

                    <Button
                        type={'submit'}
                        className={'w-full p-6'}
                        size={'lg'}
                        disabled={isLoading}
                    >
                        {!isLoading ? (
                            'Login'
                        ) : (
                            <Loader/>
                        )}
                    </Button>
                    <span className={'self-container'}>
                        Don&apos;t have an account?{' '}
                        <Link
                            href={'/signup'}
                            className={'text-primary'}
                        >
                            Sign Up
                        </Link>
                    </span>
                </form>
            ) : (
                <form
                    onChange={() => {
                        if (submitError) setSubmitError('');
                    }}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={'w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'}>
                    <Link
                        href='/'
                        className={' w-full flex justify-left items-center'}
                    >
                        <Image
                            src={Logo}
                            alt='cypress Logo'
                            width={50}
                            height={50}
                        />
                        <span className='font-semibold dark:text-white text-4xl first-letter:ml-2'>
                        cypress.
                    </span>
                    </Link>
                    <FormDescription
                        className={'text-foreground/60'}
                    >
                        An all-In-One Collaboration and Productivity Platform
                    </FormDescription>
                    {!confirmation && !codeExchangeError && (
                        <>
                            <CustomFormInput
                                isLoading={isLoading}
                                control={form.control}
                                name={'email'}
                                label={'Email'}
                                placeholder={'Email'}
                            />
                            <CustomFormInput
                                isLoading={isLoading}
                                control={form.control}
                                name={'password'}
                                label={'Password'}
                                placeholder={'Password'}
                            />
                            <CustomFormInput
                                isLoading={isLoading}
                                control={form.control}
                                name={'confirmPassword'}
                                label={'Confirm Password'}
                                placeholder={'Confirm Password'}
                            />

                            <Button
                                type='submit'
                                className='w-full p-6'
                                disabled={isLoading}
                            >
                                {!isLoading ? 'Create Account' : <Loader/>}
                            </Button>
                        </>
                    )}

                    {submitError && <FormMessage>{submitError}</FormMessage>}
                    <span className='self-container'>
                    Already have an account?{' '}
                        <Link
                            href={'/login'}
                            className='text-primary'
                        >
                        Login
                    </Link>
                    </span>
                    {(confirmation || codeExchangeError) && (
                        <>
                            <Alert className={confirmationAndErrorStyles}>
                                {!codeExchangeError && <MailCheck className='h-4 w-4'/>}
                                <AlertTitle>
                                    {codeExchangeError ? 'Invalid Link' : 'Check your email.'}
                                </AlertTitle>
                                <AlertDescription>
                                    {codeExchangeError || 'An email confirmation has been sent.'}
                                </AlertDescription>
                            </Alert>
                        </>
                    )}
                </form>
            )}
        </Form>
    )
}

export default AuthForm;