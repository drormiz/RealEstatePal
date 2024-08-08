import { Container, Typography, Box } from "@mui/material";

const HomePage = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "70vh",
          width: "100vw",
        }}
      >
        <Box
          sx={{
            backgroundImage: 'url("/assets/homepage.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "relative",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            flexDirection: "column",
            zIndex: 3,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: "4.5rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Real Estate Pal
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: "2rem",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Your trusted companion in the world of property investment.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
