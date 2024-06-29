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
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import { getClient } from "../../../../axios";

const PurchaseGroupsFeed = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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

  const handleDeleteGroup = async (groupId) => {
    try {
      await getClient().delete(`api/purchaseGroups/${groupId}`);
      setPurchaseGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId));
    } catch (error) {
      console.error("Error deleting purchase group:", error);
    }
    setOpenDeleteDialog(false);
  };

  const handleEditGroup = (group) => {
    navigate('/add-purchase-group', { state: { group } });
  };

  const handleOpenDeleteDialog = (group) => {
    setCurrentGroup(group);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
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

                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {}}
                          style={{ marginTop: "10px" }}
                        >
                          View Group
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(group)}
                          color="error"
                          style={{ width: "100%" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6}>
                        <IconButton
                          onClick={() => handleEditGroup(group)}
                          color="inherit"
                          style={{ width: "100%" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Search Purchase Groups"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
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
