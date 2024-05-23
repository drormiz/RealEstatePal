import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';

export const routers= [
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'register',
        element: <Register />,
    },
];

const UnauthenticatedRoutes = () => (
    <Routes>
        {routers.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
        <Route path='*' element={<Navigate to='login' />} />
    </Routes>
);

export default UnauthenticatedRoutes;