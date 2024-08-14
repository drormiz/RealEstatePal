import {
  Delete,
  HourglassEmpty,
  CheckCircleOutline,
  HighlightOff
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Stack
} from '@mui/material';
import React from 'react';

const Request = ({ request, setOpen, setDeleteRequestId }) => {
  const renderProperty = (label, value) => (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant='subtitle2'
        color='textSecondary'
        sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant='body1' color='textPrimary'>
        {value}
      </Typography>
    </Box>
  );

  const handleClickDelete = requestId => {
    setDeleteRequestId(requestId);
    setOpen(true);
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return (
          <HourglassEmpty
            sx={{
              verticalAlign: 'middle',
              mr: 1,
              color: 'orange'
            }}
          />
        );
      case 'approved':
        return (
          <CheckCircleOutline
            sx={{
              verticalAlign: 'middle',
              mr: 1,
              color: 'green'
            }}
          />
        );
      case 'rejected':
        return (
          <HighlightOff
            sx={{
              verticalAlign: 'middle',
              mr: 1,
              color: 'red'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      key={request._id}
      variant='outlined'
      elevation={10}
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        padding: '16px !important'
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Stack direction='row' alignItems='center' spacing={3}>
          {getStatusIcon()}
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Group Name: {request.group?.name || 'Loading...'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>Status:</Typography>
            <Typography variant='body2' color='textSecondary' sx={{ ml: 1 }}>
              {request.status}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>Investing amount:</Typography>
            <Typography
              variant='body1'
              color='textPrimary'
              sx={{ fontWeight: 500, ml: 1 }}>
              ${request.priceToInvest}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          edge='end'
          color='default'
          onClick={() => handleClickDelete(request._id)}
          sx={{
            color: 'gray',
            '&:hover': {
              color: 'darkgray'
            }
          }}>
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
};

export default Request;
