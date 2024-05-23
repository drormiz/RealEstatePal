import { z } from 'zod';

export const registerFormSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(8, 'Password must have at least 8 characters'),
    passwordConfirmation: z.string(),
}).refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
});