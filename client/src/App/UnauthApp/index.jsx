import Routes from './components/Routes';
import Footer from '../UnauthApp/components/HomePage/footer';
import { Column, Row } from "../../Layout";
import { UserProvider } from "../AuthApp/contexts/UserContext";

const UnauthenticatedApp = () => (
    <UserProvider loggedUser={null}>
        <Column sx={{ minHeight: "100vh", width: 1 }}>
      <Row sx={{ flex: 1 }}>
        <Column sx={{ width: 1 }}>
          <Routes />
        </Column>
      </Row>
      <Footer />
    </Column>
    </UserProvider>
);

export default UnauthenticatedApp;