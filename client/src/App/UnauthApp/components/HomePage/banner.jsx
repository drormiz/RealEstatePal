import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const Banner = ({ title, subtitle, imageUrl }) => {
  return (
    <Box
      flexDirection={"column"}
      sx={{ height: "400px", width: "400px", border: "none" }}
    >
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          {title}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          {subtitle}
        </Typography>
      </Stack>
      <img
        src={imageUrl}
        alt="group"
        style={{
          width: "400px",
          height: "300px",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default Banner;
