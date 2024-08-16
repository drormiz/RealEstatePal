import { Column, Row } from "../../Layout";
import AppBar from "./components/AppBar";
import AuthenticatedRoutes from "./components/Routes";
import { UserProvider } from "./contexts/UserContext";
import Footer from "./components/HomePage/footer";

const AuthenticatedApp = ({ user }) => (
  <UserProvider loggedUser={user}>
    <Column sx={{ minHeight: "100vh", width: 1 }}>
      <AppBar />
      <Row sx={{ flex: 1 }}>
        <Column sx={{ width: 1 }}>
          <AuthenticatedRoutes />
        </Column>
      </Row>
      <Footer />
    </Column>
  </UserProvider>
);

export default AuthenticatedApp;
