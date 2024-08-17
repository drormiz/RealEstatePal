import React, { useState, useEffect } from "react";
import { AppBar as MuiAppBar, Typography, Toolbar, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import { TabContext, TabList } from "@mui/lab"; // Import TabContext and TabList
import Tab from "@mui/material/Tab";

const AppBar = () => {
  const location = useLocation();
  const [value, setValue] = useState("1");

  useEffect(() => {
    // Determine the tab value based on the current path
    switch (location.pathname) {
      case "/properties":
        setValue("1");
        break;
      case "/purchasing-groups":
        setValue("2");
        break;
      case "/info":
        setValue("3");
        break;
      default:
        setValue("1");
    }
  }, [location.pathname]);

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
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          padding: "0 24px",
          position: "sticky",
          top: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "primary.main",
                marginRight: 4,
                textDecoration: "none",
              }}
            >
              RealEstatePal
            </Typography>

            <TabContext value={value}>
              <Box sx={{ marginLeft: 2 }}>
                <TabList onChange={handleChange} aria-label="AppBar tabs">
                  <Tab
                    label="Properties"
                    value="1"
                    component={Link}
                    to="/properties"
                  />
                  <Tab
                    label="Groups"
                    value="2"
                    component={Link}
                    to="/purchasing-groups"
                  />
                  <Tab label="My Pal" value="3" component={Link} to="/info" />
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
