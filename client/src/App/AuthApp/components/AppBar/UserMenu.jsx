import {
  LightMode,
  Logout,
  ModeNight,
  PlusOne,
  Info,
  AccountCircle
} from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
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
  const { toggleColorMode } = useColorMode();
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

    navigate('/login');
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

  const navigateToAddPurchaseGroupPage = () => {
    navigate('/add-purchase-group');
    closeMenu();
  };

  const navigateToAddProperty = () => {
    navigate('/add-property');
    closeMenu();
  };

  const navigateToPurchaseGroupFeed = () => {
    navigate('/purchase-groups-feed');
    closeMenu();
  };

  const navigateToInfo = () => {
    navigate('/info');
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
          onClick={navigateToAddPurchaseGroupPage}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <PlusOne color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Add Purchase Group
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={navigateToPurchaseGroupFeed}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <GroupsIcon color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Purchase Groups
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={navigateToInfo}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            <Info color='primary' />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Info
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={toggleColorMode}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
          <ListItemIcon>
            {mode === 'light' ? (
              <LightMode color='primary' />
            ) : (
              <ModeNight color='primary' />
            )}
          </ListItemIcon>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Change Color Mode
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
