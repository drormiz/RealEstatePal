import { zodResolver } from '@hookform/resolvers/zod';
import { Email, Key } from '@mui/icons-material';
import { Button, Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Center, Column } from '../../../../Layout';
import { useUser } from '../../../../Providers/UserProvider';
import { loginUserFn, googleSignin } from '../../../../axios/auth';
import { loginFormSchema } from './validationSchema';

const LoginForm = () => {
    const { register, handleSubmit } = useForm({ resolver: zodResolver(loginFormSchema) });
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [rememberMe, setRememberMe] = useState(false);

    const { mutate: loginUser } = useMutation({
        mutationFn: loginUserFn,
        onSuccess: ({ data: { accessToken, user, refreshToken } }) => {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('refreshToken', refreshToken)
            setUser(user);
            navigate('/');

            toast.success('Logged In Successfully!');
        },
        onError: ({ response: { data } }) => {
            toast.error(data);
        }
    });

    const onGoogleLoginSuccess = async (credentialResponse) => {
        console.log(credentialResponse)
        try {
            const res = await googleSignin(credentialResponse)
            localStorage.setItem('token', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken)
            localStorage.setItem('user', JSON.stringify(res.user));
            setUser(res.user);
            navigate('/');

            toast.success('Logged In Successfully!');
        } catch (e) {
            console.log(e)
        }
    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed")
    }

    const changeRememberMeCheckbox = () => {
        setRememberMe(prev => !prev);
    };

    const onSubmit = data => {
        console.log(data);
        loginUser(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Column sx={{ gap: 1 }}>
                <TextField
                    {...register('username')}
                    label='Username'
                    variant='standard'
                    autoFocus
                    InputProps={{
                        endAdornment: <InputAdornment position='start'>
                            <Email />
                        </InputAdornment>
                    }}
                />
                <TextField
                    {...register('password')}
                    label='Password'
                    variant='standard'
                    type='password'
                    InputProps={{
                        endAdornment: <InputAdornment position='start'>
                            <Key />
                        </InputAdornment>
                    }}
                />
                <Center>
                    <FormControlLabel
                        control={<Checkbox value={rememberMe} onChange={changeRememberMeCheckbox} />}
                        label="Remember Me"
                    />
                </Center>
                <Button type='submit' variant='contained'>Login</Button>
                <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
            </Column>
        </form>
    );
};

export default LoginForm;