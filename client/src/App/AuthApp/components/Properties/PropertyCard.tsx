import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import {
  ArrowForward,
  Edit,
  GroupAdd,
  ImageNotSupported,
  WhatsApp,
  Email
} from '@mui/icons-material';
import { IconButton, Tooltip, Grid } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { useUser } from '../../contexts/UserContext';

const PropertyCard = ({ property }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const createPurchaseGroupFromProperty = () => {
    navigate('/add-purchase-group', {
      state: { group: { property: property._id } }
    });
  };

  const handleWhatsAppClick = phone => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleEmailClick = email => {
    window.open(`mailto:${email}`, '_blank');
  };

  const isUserOwner = user._id === property.owner?._id;

  return (
    <Card
      sx={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        margin: '20px 0'
      }}>
      {/* Carousel or Image Not Supported Icon */}
      {property.images && property.images.length > 0 ? (
        property.images.length > 1 ? (
          <Box sx={{ height: 200 }}>
            <Carousel
              sx={{ height: '100%' }}
              indicators={true}
              navButtonsAlwaysVisible={false}
              animation='slide'
              cycleNavigation={true}
              interval={3000}>
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`property-image-${index}`}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'fill'
                  }}
                />
              ))}
            </Carousel>
          </Box>
        ) : (
          <Box sx={{ height: 200 }}>
            <img
              src={property.images[0]}
              alt='property-image'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )
      ) : (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.200'
          }}>
          <ImageNotSupported sx={{ fontSize: 60, color: 'grey.500' }} />
        </Box>
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant='h6' component='div' fontWeight='bold'>
          {property.name}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {`Meters: ${property.meters} | Rooms: ${property.numberOfRooms} | Type: ${property.propertyType}`}
        </Typography>
        <Typography variant='h6' color='text.primary'>
          ${property.price}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Tooltip title='create purchase group'>
          <IconButton
            onClick={createPurchaseGroupFromProperty}
            size='small'
            color='primary'>
            <GroupAdd />
          </IconButton>
        </Tooltip>
        {!isUserOwner && (
          <Grid container spacing={2}>
            {property.owner?.phoneNumber && (
              <Grid item>
                <Tooltip title='Contact the owner via WhatsApp'>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() =>
                      handleWhatsAppClick(property.owner.phoneNumber)
                    }>
                    <WhatsApp />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            <Grid item>
              <Tooltip title='Contact the owner via Email'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleEmailClick(property.owner.email)}>
                  <Email />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        )}
        <IconButton
          component={Link}
          to={`/properties/${property._id}`}
          size='small'
          color='primary'>
          <ArrowForward />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
