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
  Box,
  InputAdornment,
  Skeleton,
  Fab,
  Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getClient } from "../../../../axios";
import JoinPurchaseGroupForm from "../JoinPurchaseGroup";
import PurchaseGroupCard from "./PurchaseGroupCard";

const PurchaseGroupsFeed = () => {
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null); // Added to track the selected group for the dialog

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      try {
        const response = await getClient().get("api/purchaseGroups");
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
      setPurchaseGroups((prevGroups) =>
        prevGroups.filter((group) => group._id !== groupId)
      );
    } catch (error) {
      console.error("Error deleting purchase group:", error);
    }
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog = (group) => {
    setCurrentGroup(group);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseJoinDialog = () => {
    setIsRequestDialogOpen(false);
    setSelectedGroup(null); // Clear the selected group
  };

  const handleJoinGroup = (group) => {
    setSelectedGroup(group); // Set the selected group
    setIsRequestDialogOpen(true); // Open the dialog
  };

  return (
    <Container >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
        <Typography
          variant='h3'
          sx={{
            borderBottom: '3px solid',
            borderColor: 'primary.main',
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
          Groups
        </Typography>

        <Box
          sx={{
            flex: 1,
            maxWidth: '600px',
            marginLeft: '20px'
          }}>
          <TextField
            label="Search Purchase Groups"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}

            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'divider'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputBase-input': {
                padding: '12px 14px',
                fontSize: '1rem'
              }
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {filteredGroups.map((group) => (
              <PurchaseGroupCard handleJoinGroup={handleJoinGroup} group={group} handleOpenDeleteDialog={handleOpenDeleteDialog}/>     
            ))}
          </Grid>
        </Grid>
     
      </Grid>

      <JoinPurchaseGroupForm
        isOpen={isRequestDialogOpen}
        group={selectedGroup}
        onClose={handleCloseJoinDialog}
      />

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
