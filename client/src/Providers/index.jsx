import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './ThemeProvider';
import UserProvider from './UserProvider';

const queryClient = new QueryClient();

export const Providers = ({ children }) => (
        <ThemeProvider>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    {children}
                </UserProvider>
            </QueryClientProvider>
        </ThemeProvider>
);