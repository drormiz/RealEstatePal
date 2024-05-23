import { AppBar as MuiAppBar, Typography } from '@mui/material';
import { Row } from '../../../../Layout';
import { useUser } from '../../../../Providers/UserProvider';
import UserMenu from './UserMenu';

const AppBar = () => {
    const { user } = useUser();

    return (
        <MuiAppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Row sx={{ width: 1, padding: 1, alignItems: 'center' }}>
                <Typography variant='h6' sx={{ flex: 1 }}>Hello, {user?.name}</Typography>
                <UserMenu />
            </Row>
        </MuiAppBar>
    );
};

export default AppBar;