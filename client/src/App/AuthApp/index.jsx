import { Column, Row } from "../../Layout";
import AppBar from "./components/AppBar";
import AuthenticatedRoutes from "./components/Routes";
import { UserProvider } from "./contexts/UserContext";

const AuthenticatedApp = ({ user }) => (
  <UserProvider loggedUser={user}>
    <Column sx={{ height: 1, width: 1 }}>
      <AppBar />
      <Row sx={{ height: 1, width: 1, overflow: "auto" }}>
        <Column sx={{ width: 1, height: 1 }}>
          <AuthenticatedRoutes />
        </Column>
      </Row>
    </Column>
  </UserProvider>
);

export default AuthenticatedApp;
