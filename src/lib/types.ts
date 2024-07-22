import {z} from 'zod'

export const FormSchema = (type: string) => z.object({
    email: z.string()
        .email({message: 'Invalid Email'}),
    password: z
        .string()
        .min(8, 'Password must be a minimum of 8 characters'),
    confirmPassword: type === 'login'
        ? z.string().optional()
        : z.string().min(8, 'Password must be a minimum of 8 characters'),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
});
