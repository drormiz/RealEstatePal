import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from '../Profile/Profile';
import AddGroup from "../AddEditGroup/AddPurchaseGroup";
import PurchaseGroupsFeed from "../PurchaseGroupsFeed/index";

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
        <Route path='/purchase-groups-feed'>
            <Route index element={<PurchaseGroupsFeed/>} />
        </Route>
        <Route path='*' element={<Navigate to="/" />} />
    </Routes>
);

export default AuthenticatedRoutes;