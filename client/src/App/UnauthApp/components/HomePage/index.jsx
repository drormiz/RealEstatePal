import React from 'react';
import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Skeleton,
  Container,
  Button,
  AppBar,
  Toolbar
} from '@mui/material';
import PropertyCard from '../../../AuthApp/components/Properties/PropertyCard';
import { getClient, getUnauthenticatedClient } from '../../../../axios';
import HorizontalPanel from './horizontal-panel';
import Banner from './banner';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../AuthApp/contexts/UserContext';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getUnauthenticatedClient().get(`api/properties`);
        setProperties(response.data.properties);
      } catch (error) {
        console.error('Error fetching properties and groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      {!user && (
        <AppBar
          position='static'
          sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              color='primary'
              sx={{ marginRight: 2 }}
              onClick={() => {
                navigate('/login');
              }}>
              Login
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                navigate('/register');
              }}>
              Register
            </Button>
          </Toolbar>
        </AppBar>
      )}
      {/* Banner Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          width: '100vw'
        }}>
        <Box
          sx={{
            backgroundImage: 'url("/assets/homepage.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2
          }}
        />
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            flexDirection: 'column',
            zIndex: 3
          }}>
          <Typography
            variant='h2'
            component='h1'
            sx={{
              fontSize: '4.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}>
            Real Estate Pal
          </Typography>
          <Typography
            variant='h2'
            component='h2'
            sx={{
              fontSize: '2rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}>
            Your trusted companion in the world of property investment.
          </Typography>
        </Box>
      </Box>

      {/* Properties Section */}
      <Container
        maxWidth='lg'
        sx={{
          paddingInline: '50px',
          position: 'relative',
          overflowX: 'hidden',
          boxShadow: 'none'
        }}>
        <Typography
          variant='h5'
          sx={{ textAlign: 'start', fontWeight: 'bold', mt: 4 }}>
          Find Out Our Properties
        </Typography>
        <Box
          sx={{
            mt: 1,
            borderRadius: '8px',
            position: 'relative',
            backgroundColor: '#E5E4E2'
          }}>
          <HorizontalPanel properties={properties}>
            {!loading
              ? properties.map(property => (
                  <Box
                    key={property._id}
                    sx={{ minWidth: 300, marginRight: 2 }}>
                    <PropertyCard property={property} />
                  </Box>
                ))
              : Array.from(new Array(3)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant='rectangular'
                    width={300}
                    height={400}
                    sx={{ margin: '0 20px' }}
                  />
                ))}
          </HorizontalPanel>
        </Box>
      </Container>

      {/* Banners Section */}
      <Container
        maxWidth='xl'
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
          overflowX: 'hidden'
        }}>
        <Banner
          title={'1'}
          subtitle={'Meet Your Purchasing Group'}
          imageUrl={'/assets/group.jpg'}
        />
        <Banner
          title={'2'}
          subtitle={'Pick Property To Invest'}
          imageUrl={'/assets/realestate.jpg'}
        />
        <Banner
          title={'3'}
          subtitle={'Make Your Profit'}
          imageUrl={'/assets/profit.jpg'}
        />
      </Container>
    </>
  );
};

export default HomePage;
