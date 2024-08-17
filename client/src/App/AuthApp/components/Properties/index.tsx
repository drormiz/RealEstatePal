import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Skeleton,
  Fab,
  Tooltip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";
import ListIcon from "@mui/icons-material/List";
import { getClient } from "../../../../axios";
import PropertyCard from "./PropertyCard";
import PropertyMap from "./PropertyMap"; // Make sure to create this component

const Properties = () => {
  const [propertiesToDisplay, setPropertiesToDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false); // State to track map view

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getClient().get(
          `api/properties${searchQuery ? `?name=${searchQuery}` : ""}`
        );
        setPropertiesToDisplay(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            borderBottom: "3px solid",
            borderColor: "primary.main",
            paddingBottom: "8px",
            display: "inline-block",
          }}
        >
          Properties
        </Typography>

        <Box
          sx={{
            flex: 1,
            maxWidth: "600px",
            marginLeft: "20px",
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search properties by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "divider",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                fontSize: "1rem",
              },
            }}
          />
        </Box>

        {/* Toggle View Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setMapView((prev) => !prev)}
          startIcon={mapView ? <ListIcon /> : <MapIcon />}
          sx={{ marginLeft: "20px" }}
        >
          {mapView ? "List View" : "Map View"}
        </Button>
      </Box>

      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "70vh",
          marginTop: "20px",
        }}
      >
        {loading ? (
          <Grid container spacing={4}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={300}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton width="60%" height={30} sx={{ marginTop: "10px" }} />
                <Skeleton width="80%" height={20} />
                <Skeleton width="40%" height={20} />
              </Grid>
            ))}
          </Grid>
        ) : mapView ? (
          <PropertyMap properties={propertiesToDisplay} /> // Display the map view
        ) : (
          <Grid container spacing={4}>
            {propertiesToDisplay?.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property._id}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Tooltip title="Add Property" arrow>
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            color: "white",
            boxShadow: 3,
          }}
          onClick={() => {
            window.location.href = "/add-property";
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default Properties;
