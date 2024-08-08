import { Paper, Typography, useTheme, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Center, Column } from "../../../../Layout";

const UserAdmission = ({ formTitle, to, message, FormContent }) => {
  const {
    palette: { mode },
  } = useTheme();

  const paperStyles = {
    width: 400,
    padding: 2,
  };

  const logoStyles = {
    alignSelf: "center",
    margin: "10px",
  };

  const titleStyles = {
    fontSize: 30,
  };

  const messageStyles = {
    fontSize: 14,
  };

  const columnStyles = {
    gap: 2,
    alignItems: "center",
  };

  const containerStyles = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a19595",
  };

  return (
    <Grid sx={containerStyles}>
      <img
        src={"assets/logo.jpg"}
        alt="logo"
        height="120px"
        width="120px"
        style={logoStyles}
      />

      <Paper elevation={5} sx={paperStyles}>
        <Column sx={columnStyles}>
          <Typography sx={titleStyles}>{formTitle}</Typography>
          <FormContent />
          <Center>
            <Link
              to={to}
              style={{ color: mode === "light" ? "black" : "white" }}
            >
              <Typography sx={messageStyles}>{message}</Typography>
            </Link>
          </Center>
        </Column>
      </Paper>
    </Grid>
  );
};

export default UserAdmission;
