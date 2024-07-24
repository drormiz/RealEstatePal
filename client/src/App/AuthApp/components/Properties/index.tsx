import React, { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import { getClient } from '../../../../axios';
import PropertyCard from './PropertyCard';

const Properties = () => {
  const [propertiesToDisplay, setPropertiesToDisplay] = useState([]);

  useEffect(() => {
    (async () => {
      const properties = await getClient().get(`api/properties`);

      setPropertiesToDisplay(properties.data);
    })();
  }, []);

  return (
    <Container>
      <Typography variant='h2'>Properties</Typography>
      {propertiesToDisplay?.map(property => (
        <PropertyCard property={property} />
      ))}
    </Container>
  );
};

export default Properties;
