import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useUser } from '../../contexts/UserContext';

const PropertyCard = ({ property }) => {
  const { user, setUser } = useUser();

  const isUserOwner = user._id === property.owner;

  return (
    <Card sx={{ display: 'flex', width: '100%', margin: '20px 0' }}>
      <CardMedia
        component='img'
        sx={{ width: 200 }}
        image={property.image}
        alt={property.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {property.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {property.description}
          </Typography>
          <Typography variant='h6' color='text.primary'>
            ${property.price}
          </Typography>
        </CardContent>
        <CardActions sx={{ marginTop: 'auto', justifyContent: 'flex-end' }}>
          {isUserOwner && (
            <IconButton
              component={Link}
              to={`/properties/${property._id}`}
              size='small'
              color='primary'>
              <Edit />
            </IconButton>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default PropertyCard;
