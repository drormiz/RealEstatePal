import UserAdmission from '../UserAdmission';
import RegisterForm from './RegisterForm';

const Register = () => (
    <UserAdmission
        formTitle='Register'
        FormContent={RegisterForm}
        to='/login'
        message='Already signed in?'
    />
)

export default Register