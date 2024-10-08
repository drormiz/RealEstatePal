import { Route, Routes, Navigate } from 'react-router-dom';
import Profile from '../Profile/Profile';
import AddPurchaseGroup from '../PurchaseGroupForm/AddPurchaseGroup';
import PurchaseGroupsFeed from '../PurchaseGroupsFeed/index';
import AddProperty from '../PropertyForm/AddProperty';
import EditProperty from '../PropertyForm/EditProperty';
import ViewPurchaseGroup from '../ViewPurchaseGroup/index';
import Info from '../Info/index';
import Properties from '../Properties';
import HomePage from '../../../UnauthApp/components/HomePage/index';
import UserRequests from '../UserRequests';
import Statistics from '../Statistics';

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path='/home'>
      <Route index element={<HomePage />} />
    </Route>
    <Route path='/profile'>
      <Route index element={<Profile />} />
    </Route>
    <Route path='/add-purchase-group'>
      <Route index element={<AddPurchaseGroup />} />
    </Route>
    <Route path='/properties'>
      <Route index element={<Properties />} />
    </Route>
    <Route path='/add-property'>
      <Route index element={<AddProperty />} />
    </Route>
    <Route  path='/properties/:propertyId'>
      <Route index element={<EditProperty />} />
    </Route>
    <Route path='/properties/:id'>
      <Route index element={<EditProperty />} />
    </Route>
    <Route path='/requests'>
      <Route index element={<UserRequests />} />
    </Route>
    <Route path='/purchasing-groups'>
      <Route index element={<PurchaseGroupsFeed />} />
    </Route>
    <Route path='/view-purchase-group'>
      <Route index element={<ViewPurchaseGroup />} />
    </Route>
    <Route path='/info'>
      <Route index element={<Info />} />
    </Route>
    <Route path="/statistics">
      <Route index element={<Statistics />} />
    </Route>
    <Route path='*' element={<Navigate to='/home' />} />
  </Routes>
);

export default AuthenticatedRoutes;
