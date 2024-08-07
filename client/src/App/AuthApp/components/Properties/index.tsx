import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import { getClient } from '../../../../axios';
import PropertyCard from './PropertyCard';

const Properties = () => {
  const [propertiesToDisplay, setPropertiesToDisplay] = useState([]);

  useEffect(() => {
    (async () => {
      const properties = await getClient().get('api/properties');
      setPropertiesToDisplay(properties.data);
    })();
  }, []);

  return (
    <Container>
      <Typography
        variant='h3'
        gutterBottom
        sx={{
          borderBottom: '3px solid',
          borderColor: 'primary.main',
          paddingBottom: '8px',
          display: 'inline-block'
        }}>
        Properties
      </Typography>
      <Grid container spacing={4}>
        {propertiesToDisplay?.map(property => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <PropertyCard property={property} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Properties;
