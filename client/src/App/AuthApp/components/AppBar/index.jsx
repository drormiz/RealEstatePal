import {
  AppBar as MuiAppBar,
  Typography,
  Button,
  Toolbar,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser } from '../../../../Providers/UserProvider';
import UserMenu from './UserMenu';

const AppBar = () => {
  const { user } = useUser();

  return (
    <MuiAppBar
      position='static'
      elevation={0}
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 24px'
      }}>
      <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            component={Link}
            to='/'
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              color: 'primary.main',
              marginRight: 4,
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}>
            RealEstatePal
          </Button>

          <Button
            component={Link}
            to='/properties'
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              color: 'primary.main',
              position: 'relative',
              marginRight: 2,
              '&:hover::after': {
                transform: 'scaleX(1)',
                transformOrigin: 'bottom left'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -2,
                width: '100%',
                height: '2px',
                backgroundColor: 'primary.main',
                transform: 'scaleX(0)',
                transformOrigin: 'bottom right',
                transition: 'transform 0.3s ease-out'
              }
            }}>
            Properties
          </Button>

          <Button
            component={Link}
            to='/purchase-groups-feed'
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              color: 'primary.main',
              position: 'relative',
              '&:hover::after': {
                transform: 'scaleX(1)',
                transformOrigin: 'bottom left'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -2,
                width: '100%',
                height: '2px',
                backgroundColor: 'primary.main',
                transform: 'scaleX(0)',
                transformOrigin: 'bottom right',
                transition: 'transform 0.3s ease-out'
              }
            }}>
            Groups
          </Button>
        </Box>
        <UserMenu />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
