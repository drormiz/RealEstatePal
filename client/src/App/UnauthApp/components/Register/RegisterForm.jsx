import { zodResolver } from '@hookform/resolvers/zod';
import { Email, Key, KeyOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Column } from '../../../../Layout';
import { registerUserFn } from '../../../../axios/auth';
import { registerFormSchema } from './validationSchema';

const RegisterForm = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerFormSchema) });
    const navigate = useNavigate();

    const { mutate: registerUser } = useMutation({
        mutationFn: registerUserFn,
        onSuccess: () => {
            navigate('/login');
            toast.success("Registered User Successfully!");
        },
        onError: ({ response: { data: { message } } }) => {
            toast.error(message);
        }
    });

    return (
        <form onSubmit={handleSubmit(registerUser)}>
            <Column sx={{ gap: 1 }}>
                <TextField
                    {...register('name')}
                    label='Full Name'
                    variant='standard'
                    autoFocus
                    sx={{
                        maxWidth: 220,
                        '& .MuiFormHelperText-root': {
                            maxWidth: 220,
                        }
                    }}
                />
                <TextField
                    {...register('username')}
                    label='Username'
                    variant='standard'
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ''}
                    sx={{
                        maxWidth: 220,
                        '& .MuiFormHelperText-root': {
                            maxWidth: 220,
                        }
                    }}
                />
                 <TextField
                    {...register('email')}
                    label='Email'
                    variant='standard'
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                    InputProps={{
                        endAdornment: <InputAdornment position='start'>
                            <Email />
                        </InputAdornment>
                    }}
                    sx={{
                        maxWidth: 220,
                        '& .MuiFormHelperText-root': {
                            maxWidth: 220,
                        }
                    }}
                />
                <TextField
                    {...register('password')}
                    label='Password'
                    variant='standard'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={() => setIsPasswordShown(prev => !prev)}>
                                {isPasswordShown ? <KeyOff /> : <Key />}
                            </IconButton>
                    }}
                    sx={{
                        maxWidth: 220,
                        '& .MuiFormHelperText-root': {
                            maxWidth: 220,
                        }
                    }}
                />
                <TextField
                    {...register('passwordConfirmation')}
                    label='Password Confirmarion'
                    variant='standard'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.passwordConfirmation}
                    helperText={errors.passwordConfirmation ? errors.passwordConfirmation.message : ''}
                    sx={{
                        maxWidth: 220,
                        '& .MuiFormHelperText-root': {
                            maxWidth: 220,
                        }
                    }}
                />
                <Button type='submit' variant='contained'>Register</Button>
            </Column>
        </form>
    );
};

export default RegisterForm;