import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useUser } from "../../contexts/UserContext";
import { getClient } from "../../../../axios";

const PurchaseGroupsFeed = () => {
  const { user } = useUser();
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await getClient().get(`api/purchaseGroups`);
        setPurchaseGroups(response.data);
      } catch (error) {
        console.error("Error fetching purchase groups:", error);
      }
    };
    fetchPurchaseGroups();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = purchaseGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteGroup = (groupId) => {
    // Implement delete functionality here
    console.log("Deleting group with ID:", groupId);
    // Close the dialog after deletion
    setOpenDeleteDialog(false);
  };

  const handleEditGroup = (group) => {
    // Implement edit functionality here
    console.log("Editing group:", group);
    // Optionally, navigate to edit form or handle in-place editing
  };

  const handleOpenDeleteDialog = (group) => {
    setCurrentGroup(group);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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
                  <Typography variant="body2" color="textSecondary">
                    {group.description}
                  </Typography>
                </div>

                <Grid container justifyContent="space-between" alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      // Implement action for view group button if needed
                    }}
                    style={{ marginTop: "10px" }}
                  >
                    View Group
                  </Button>
                  <div>
                    <IconButton
                      onClick={() => handleOpenDeleteDialog(group)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditGroup(group)}
                      color="inherit"
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this group?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteGroup(currentGroup._id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PurchaseGroupsFeed;
