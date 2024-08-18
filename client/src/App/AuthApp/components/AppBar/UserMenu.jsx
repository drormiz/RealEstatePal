import { Logout, AccountCircle, List } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '../../../../Providers/ThemeProvider';
import { useUser } from '../../../../Providers/UserProvider';
import { logoutUserFn } from '../../../../axios/auth';
import UserAvatar from './components/UserAvatar';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const {
    palette: { mode, primary }
  } = useTheme();
  const { user, setUser } = useUser();
  const queryCache = useQueryClient().getQueryCache();

  const logoutUser = async () => {
    try {
      await logoutUserFn();
    } catch (e) {
      console.log(e.message);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
    queryCache.clear();

    navigate('/home');
    closeMenu();
  };

  const openMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const navigateToUserProfile = () => {
    navigate('/profile');
    closeMenu();
  };

  const navigateToGroupRequests = () => {
    navigate(`/requests`);
    closeMenu();
  };

  return (
    <>
      <Tooltip title='Account settings'>
        <IconButton onClick={openMenu}>
          <UserAvatar user={user} />
        </IconButton>
      </Tooltip>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem
          onClick={navigateToUserProfile}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <AccountCircle color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Profile
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={navigateToGroupRequests}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <List color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            My Requests
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={logoutUser}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <Logout color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
