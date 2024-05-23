import { object, string } from "zod";

const LoginUserSchema = {
    body: object({
        password: string({
            required_error: "Password is required",
        }),
        username: string({
            required_error: "Username is required",
        }),
    })
}

const NewUserSchema = LoginUserSchema.body.extend({
    password: string({
        required_error: "Password is required"
    }).min(8, 'Password must have at least 8 characters'),
    name: string({
        required_error: "Name is required",
    }),
    passwordConfirmation: string({
        required_error: "PasswordConfirmation is required",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});

export const LoginUserValidationSchema = object(LoginUserSchema);
export const NewUserValidationSchema = object({ body: NewUserSchema });