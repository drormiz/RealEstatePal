import UserAdmission from '../UserAdmission';
import LoginForm from './LoginForm';

const Login = () => (
    <UserAdmission
        formTitle='Login'
        FormContent={LoginForm}
        to='/register'
        message='Need an account? Click here'
    />
);

export default Login;