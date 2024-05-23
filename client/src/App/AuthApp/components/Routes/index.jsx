import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from '../Profile/Profile';
import AddGroup from "../AddEditGroup/AddPurchaseGroup";

const AuthenticatedRoutes = () => (
    <Routes>
        <Route path='/'>
            <Route index element={<>hi</>} />
        </Route>
        <Route path='/profile'>
            <Route index element={<Profile/>} />
        </Route>
        <Route path='/add-purchase-group'>
            <Route index element={<AddGroup/>} />
        </Route>
        <Route path='*' element={<Navigate to="/" />} />
    </Routes>
);

export default AuthenticatedRoutes;