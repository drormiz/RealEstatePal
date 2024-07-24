import { Route, Routes, Navigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import AddGroup from "../AddEditGroup/AddPurchaseGroup";
import PurchaseGroupsFeed from "../PurchaseGroupsFeed/index";
import AddProperty from "../AddEditProperty/AddProperty";
import JoinPurchaseGroupForm from "../JoinPurchaseGroup/index";
import ViewPurchaseGroup from "../ViewPurchaseGroup/index";

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/">
      <Route index element={<>hi</>} />
    </Route>
    <Route path="/profile">
      <Route index element={<Profile />} />
    </Route>
    <Route path="/add-purchase-group">
      <Route index element={<AddGroup />} />
    </Route>
    <Route path="/add-property">
      <Route index element={<AddProperty />} />
    </Route>
    <Route path="/purchase-groups-feed">
      <Route index element={<PurchaseGroupsFeed />} />
    </Route>
    <Route path="/join-purchase-group">
      <Route index element={<JoinPurchaseGroupForm />} />
    </Route>
    <Route path="/view-purchase-group">
      <Route index element={<ViewPurchaseGroup />} />
    </Route>
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AuthenticatedRoutes;
