
import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#2E2E2E",
        color: "#FFF",
        padding: "20px 0",
        marginTop: 5,
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/assets/logo.jpg"
            alt="Logo"
            style={{ height: "50px", marginRight: "10px" }}
          />
          <Typography variant="h6">RealEstatePal.</Typography>
        </Box>
        <Typography variant="body2" sx={{ textAlign: "center", flex: 1 }}>
          © 2024 RealEstatePal. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body2">Privacy Policy</Typography>
          <Typography variant="body2">Terms of Service</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
