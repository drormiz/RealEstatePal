import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../Login';
import Register from '../Register';
import HomePage from '../HomePage';

export const routers= [
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: 'register',
        element: <Register />,
    },
    {
        path: 'home',
        element: <HomePage />,
    },
];

const UnauthenticatedRoutes = () => (
    <Routes>
        {routers.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
        <Route path='*' element={<Navigate to='home' />} />
    </Routes>
);

export default UnauthenticatedRoutes;