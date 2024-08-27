import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Container,
  TextField,
  Box,
  InputAdornment,
  Skeleton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getClient } from '../../../../axios';
import JoinPurchaseGroupForm from '../JoinPurchaseGroup';
import PurchaseGroupCard from './PurchaseGroupCard';

const PurchaseGroupsFeed = () => {
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Ref for the intersection observer
  const observer = useRef();

  const lastGroupElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchPurchaseGroups = async () => {
      setLoading(true);
      try {
        const response = await getClient().get(
          `api/purchaseGroups?page=${page}&limit=6&searchTerm=${searchTerm}`
        );
        setPurchaseGroups(prevGroups => [
          ...prevGroups,
          ...response.data.groups
        ]);
        setHasMore(response.data.groups.length > 0);
      } catch (error) {
        console.error('Error fetching purchase groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseGroups();
  }, [page, searchTerm]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setPage(1);
    setPurchaseGroups([]);
  };

  const handleDeleteGroup = async groupId => {
    try {
      await getClient().delete(`api/purchaseGroups/${groupId}`);
      setPurchaseGroups(prevGroups =>
        prevGroups.filter(group => group._id !== groupId)
      );
    } catch (error) {
      console.error('Error deleting purchase group:', error);
    }
    setOpenDeleteDialog(false);
  };

  const handleOpenDeleteDialog = group => {
    setCurrentGroup(group);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseJoinDialog = () => {
    setIsRequestDialogOpen(false);
    setSelectedGroup(null);
  };

  const handleJoinGroup = group => {
    setSelectedGroup(group);
    setIsRequestDialogOpen(true);
  };

  return (
    <Container>
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

        <Stack
          direction={'row'}
          sx={{
            alignItems: 'center',
            width: '70%'
          }}>
          <TextField
            label='Search Purchase Groups'
            variant='outlined'
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
        </Stack>
      </Box>

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: '70vh',
          marginTop: '20px'
        }}>
        <Stack spacing={4}>
          {loading && page === 1 ? (
            Array.from(new Array(6)).map((_, index) => (
              <Box key={index} sx={{ width: '100%' }}>
                <Skeleton variant='rectangular' width='100%' height={200} />
              </Box>
            ))
          ) : (
            <>
              {purchaseGroups.length > 0 && (
                <Stack spacing={4}>
                  {purchaseGroups
                    .reduce((rows, group, index) => {
                      if (index % 3 === 0) rows.push([]);
                      rows[rows.length - 1].push(group);
                      return rows;
                    }, [])
                    .map((row, rowIndex) => (
                      <Stack
                        key={rowIndex}
                        direction='row'
                        spacing={4}
                        sx={{ width: '100%' }}>
                        {row.map((group, groupIndex) => {
                          const isLastElement =
                            purchaseGroups.length ===
                            rowIndex * 3 + groupIndex + 1;
                          return (
                            <Box
                              key={group._id}
                              ref={isLastElement ? lastGroupElementRef : null}
                              sx={{ flex: 1, maxWidth: '300px' }}>
                              <PurchaseGroupCard
                                handleJoinGroup={handleJoinGroup}
                                group={group}
                                handleOpenDeleteDialog={handleOpenDeleteDialog}
                              />
                            </Box>
                          );
                        })}
                      </Stack>
                    ))}
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Box>

      <JoinPurchaseGroupForm
        isOpen={isRequestDialogOpen}
        group={selectedGroup}
        onClose={handleCloseJoinDialog}
      />

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            Are you sure you want to delete this group?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteGroup(currentGroup._id)}
            color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PurchaseGroupsFeed;
