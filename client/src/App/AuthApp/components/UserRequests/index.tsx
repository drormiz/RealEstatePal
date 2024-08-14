import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton as MuiIconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Stack
} from '@mui/material';
import {
  Delete,
  HourglassEmpty,
  CheckCircleOutline,
  HighlightOff
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getClient } from '../../../../axios';
import EmptyRequests from './EmptyRequests';
import { useUser } from '../../contexts/UserContext';
import Request from './Request';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getClient().get(
          `api/purchaseGroups/purchaseGroupRequests?userId=${user._id}`
        );
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [user._id]);

  const handleDeleteRequest = async requestId => {
    try {
      await getClient().delete(
        `api/purchaseGroups/purchaseGroupRequest/${requestId}`
      );
      setRequests(prevRequests =>
        prevRequests.filter(req => req._id !== requestId)
      );
      toast.success('Request deleted successfully!');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request.');
    }
  };

  const handleConfirmDelete = () => {
    if (deleteRequestId) {
      handleDeleteRequest(deleteRequestId);
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDeleteRequestId(null);
  };

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Stack sx={{ height: '100%' }} spacing={1}>
          <Box sx={{ width: '25%' }}>
            <Typography
              variant='h3'
              sx={{
                borderBottom: '3px solid',
                borderColor: 'primary.main',
                paddingBottom: '8px',
                display: 'inline-block'
              }}>
              My Requests
            </Typography>
          </Box>
          <Box
            sx={{
              overflowY: 'auto',
              height: '100%'
            }}>
            {requests.length === 0 ? (
              <EmptyRequests />
            ) : (
              requests.map(request => (
                <Request
                  request={request}
                  setOpen={setOpen}
                  setDeleteRequestId={setDeleteRequestId}
                />
              ))
            )}
          </Box>
        </Stack>
      </Container>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: 'white',
              backgroundColor: '#dc3838',
              '&:hover': {
                backgroundColor: '#ff0000'
              }
            }}
            variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserRequests;
