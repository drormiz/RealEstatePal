import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useUser } from "../../contexts/UserContext";
import { getClient } from "../../../../axios";

const PurchaseGroupsFeed = () => {
  const { user } = useUser();
  const [purchaseGroups, setPurchaseGroups] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        console.log("dsadasdsa");

        const response = await getClient().get(`api/purchaseGroups`);
        console.log("response", response);
        setPurchaseGroups(response.data);
      } catch (error) {
        console.error("Error fetching purchase groups:", error);
      }
    };
    fetchPurchaseGroups();
  }, []);

  const filteredGroups = purchaseGroups;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <TextField
        label="Search Purchase Groups"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
      />
      <Grid container spacing={3}>
        {filteredGroups.map((group) => (
          <Grid item key={group._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <div>
                  <Typography variant="h5" component="div" gutterBottom>
                    {group.name} 
                  </Typography>
                  <div style={{ marginBottom: "20px" }}></div>
                  <Typography variant="body2" color="textSecondary">
                    {group.description} 
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {}}
                  style={{ marginTop: "10px" }}
                >
                  View Group
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PurchaseGroupsFeed;
