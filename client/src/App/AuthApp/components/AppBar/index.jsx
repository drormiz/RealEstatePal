import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Typography,
  Toolbar,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { TabContext, TabList, TabPanel } from '@mui/lab'; // Import TabContext, TabList, and TabPanel
import Tab from '@mui/material/Tab';

const AppBar = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <MuiAppBar
        position="static"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          padding: '0 24px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: 'primary.main',
                marginRight: 4,
                textDecoration: 'none',
              }}
            >
              RealEstatePal
            </Typography>

            <TabContext value={value}>
              <Box sx={{ marginLeft: 2 }}>
                <TabList onChange={handleChange} aria-label="AppBar tabs">
                  <Tab label="Properties" value="1" component={Link} to='/properties'  />
                  <Tab label="Groups" value="2" component={Link} to='/purchase-groups-feed' />
                  <Tab label="My Pal" value="3" component={Link} to='/info' />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <UserMenu />
        </Toolbar>
      </MuiAppBar>
    </>
  );
};

export default AppBar;