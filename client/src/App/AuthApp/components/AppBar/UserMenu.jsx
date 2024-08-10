import { LightMode, Logout, ModeNight, PlusOne, Info } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stringToColor from 'string-to-color';
import { useColorMode } from '../../../../Providers/ThemeProvider';
import { useUser } from '../../../../Providers/UserProvider';
import { logoutUserFn } from '../../../../axios/auth';

const getInitials = fullName => fullName === '' ? '' : fullName.trim().split(/\s+/).map(name => name[0].toUpperCase()).join('').slice(0, 3);

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode();
  const { palette: { mode } } = useTheme();
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
    setUser(null);
    queryCache.clear();

    navigate('/login');
    closeMenu();
  };

  const openMenu = (event) => {
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
      <Tooltip title="Account settings">
        <IconButton onClick={openMenu}>
          <Avatar
            src={user.image || ""}
            sx={{
              bgcolor: !user.image ? stringToColor(user.name) : "transparent",
              width: 60,
              height: 60,
            }}
          >
            {!user.image && getInitials(user.name)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem onClick={navigateToUserProfile}>
          <ListItemIcon style={{ marginRight: '3px' }}>
            <Avatar src={user.image || ""} sx={{ width: 40, height: 40 }}>
              {!user.image && getInitials(user.name)}
            </Avatar>
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={navigateToAddPurchaseGroupPage}>
          <ListItemIcon style={{ marginRight: '3px' }}>
            <PlusOne />
          </ListItemIcon>
          Add purchase group
        </MenuItem>
        <MenuItem onClick={navigateToPurchaseGroupFeed}>
          <ListItemIcon style={{ marginRight: '3px' }}>
            <GroupsIcon />
          </ListItemIcon>
          Purchase groups
        </MenuItem>
        <MenuItem onClick={navigateToAddProperty}>
          <ListItemIcon style={{ marginRight: '3px' }}>
            <PlusOne />
          </ListItemIcon>
          Add property
        </MenuItem>
        <MenuItem onClick={navigateToInfo}>
          <ListItemIcon style={{ marginRight: '3px' }}>
            <Info />
          </ListItemIcon>
          Info
        </MenuItem>
        <MenuItem onClick={toggleColorMode}>
          <ListItemIcon>
            {mode === 'light' ? <LightMode fontSize="small" /> : <ModeNight fontSize="small" />}
          </ListItemIcon>
          Change Color Mode
        </MenuItem>
        <MenuItem onClick={logoutUser}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
