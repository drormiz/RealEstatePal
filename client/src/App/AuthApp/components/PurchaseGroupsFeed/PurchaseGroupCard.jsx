import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Box
} from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { getClient } from '../../../../axios';
import stringToColor from 'string-to-color';
import LinearProgress from '@mui/material/LinearProgress';

const getInitials = fullName =>
  fullName === ''
    ? ''
    : fullName
        .trim()
        .split(/\s+/)
        .map(name => name[0].toUpperCase())
        .join('')
        .slice(0, 3);

const PurchaseGroupCard = ({
  group,
  handleOpenDeleteDialog,
  handleJoinGroup
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleEditGroup = group => {
    navigate('/add-purchase-group', { state: { group } });
  };

  const isUserInGroup = group => {
    return group.members.includes(user._id);
  };

  const isUserRequestedToThisGroup = group => {
    return group.purchaseGroupRequests.some(x => x.user === user._id);
  };

  const isGroupFull = group => {
    return group.members.length == group.maxMembersCount
  }
  
  return (
    <>
      <Grid item key={group._id} xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
          {isUserInGroup(group) ? (
            <IconButton
              color='primary'
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1
              }}
              disabled>
              <CheckCircleIcon sx={{color:"green"}}/>
            </IconButton>
          ) : isUserRequestedToThisGroup(group) ? (
            <IconButton
              color='primary'
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1
              }}
              disabled>
              <HourglassTopIcon />
            </IconButton>
          ) : isGroupFull(group) ? (
            <IconButton
              color='primary'
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1
              }}
              disabled>
              <LockIcon />
            </IconButton>
          ) : (
            <>
              <IconButton
                onClick={() => handleJoinGroup(group)}
                color='primary'
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1
                }}>
                <AddIcon />
              </IconButton>
            </>
          )}

  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Grid sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h5" component="div" sx={{alignSelf: 'center'}} gutterBottom>
                      {group.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h8" component="div" sx={{alignSelf: 'center', mt: 0.3 }} gutterBottom>
                    owner: 
                    </Typography>
                        <Avatar
                            src={group.owner.image || ''}
                            sx={{
                            bgcolor: !group.owner.image ? stringToColor(group.owner.name) : "",
                            width: 15,
                            height: 15,
                            ml: 0.5,
                            mt: 0.4,
                            mr: 0.3,
                            }}>
                            {!group.owner.image && getInitials(group.owner.name)}
                        </Avatar>
                        {group.owner.name}
                    
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary">
                    description: {group.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    Participation Price: {group.participationPrice}$
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {group.members?.length}/{group.maxMembersCount} members
                    </Typography>
                    <br/>
                    <LinearProgress variant="determinate" sx={{ '& .MuiLinearProgress-bar': {
    backgroundColor: isGroupFull(group) && "green",
  }}} value={(group.members?.length/group.maxMembersCount)*100}/>
                    <Typography variant="body2" color="textSecondary">
                    {(group.members?.length*group.participationPrice)?.toFixed(0)}/{group.maxMembersCount*group.participationPrice}$ recruited
                    </Typography>
                    </Grid>
                    
                  </CardContent>
                  {group.owner._id === user._id && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      px={2}
                    >
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
                    </Box>
                  )}
                  <Box p={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() =>
                        navigate("/view-purchase-group", {
                          state: { groupId: group._id },
                        })
                      }
                    >
                      View Group
                    </Button>
                  </Box>
                </Card>
              </Grid>
              </>
  );
};

export default PurchaseGroupCard;
