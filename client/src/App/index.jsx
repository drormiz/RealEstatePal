import { isEmpty } from 'lodash';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Center } from '../Layout';
import { useUser } from '../Providers/UserProvider';
import AuthenticatedApp from './AuthApp';
import UnauthenticatedApp from './UnauthApp';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  const { user } = useUser();

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
    <BrowserRouter>
      <Center sx={{ height: 1 }}>
        {!isEmpty(user) ? <AuthenticatedApp user={user} /> : <UnauthenticatedApp />}
        <ToastContainer autoClose={1500} position='bottom-right' />
      </Center>
    </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;