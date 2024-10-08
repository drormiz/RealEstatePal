import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Typography,
  Container,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Skeleton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Fab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import { getClient } from '../../../../axios';
import PropertyCard from './PropertyCard';
import PropertyMap from './PropertyMap'; // Make sure to create this component

const Properties = () => {
  const [propertiesToDisplay, setPropertiesToDisplay] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const limit = 6; // Number of properties per page

  const fetchProperties = async page => {
    setLoading(true);
    try {
      const response = await getClient().get(
        `api/properties?${searchQuery ? `name=${searchQuery}&` : ''}${
          selectedType !== 'All' ? `type=${selectedType}&` : ''
        }page=${page}&limit=${limit}`
      );

      setPropertiesToDisplay(prev => [...prev, ...response.data.properties]);
      setHasMore(response.data.properties.length > 0); // Check if more data is available
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPropertiesToDisplay([]); // Reset properties when filters change
    setCurrentPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore flag
  }, [searchQuery, selectedType]);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, searchQuery, selectedType]);

  const handleTypeChange = event => {
    setSelectedType(event.target.value);
  };

  const lastPropertyElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
          Properties
        </Typography>

        <Stack
          direction={'row'}
          sx={{
            alignItems: 'center',
            width: '70%'
          }}>
          <TextField
            variant='outlined'
            fullWidth
            placeholder='Search properties by name...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
            sx={{
              flex: 5,
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
              },
              marginRight: '20px'
            }}
          />

          <FormControl
            variant='outlined'
            sx={{ minWidth: 200, marginRight: '20px', flex: 1 }}>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              label='Property Type'
              sx={{
                backgroundColor: 'background.paper',
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
                }
              }}>
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='Penthouse'>Penthouse</MenuItem>
              <MenuItem value='Two floor'>Two floor</MenuItem>
              <MenuItem value='Ground floor'>Ground floor</MenuItem>
              <MenuItem value='Studio'>Studio</MenuItem>
              <MenuItem value='Other'>Other</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            color='primary'
            sx={{ flex: 1 }}
            onClick={() => setMapView(prev => !prev)}
            startIcon={mapView ? <ListIcon /> : <MapIcon />}>
            {mapView ? 'List View' : 'Map View'}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: '70vh',
          marginTop: '20px',
          minHeight: '300px'
        }}>
        {loading && currentPage === 1 ? (
          <Grid container spacing={4}>
            {Array.from(new Array(limit)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant='rectangular'
                  width='100%'
                  height={300}
                  sx={{ borderRadius: '8px' }}
                />
                <Skeleton width='60%' height={30} sx={{ marginTop: '10px' }} />
                <Skeleton width='80%' height={20} />
                <Skeleton width='40%' height={20} />
              </Grid>
            ))}
          </Grid>
        ) : mapView ? (
          <PropertyMap properties={propertiesToDisplay} />
        ) : (
          <Grid container spacing={4}>
            {propertiesToDisplay.map((property, index) => {
              if (propertiesToDisplay.length === index + 1) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={property._id}
                    ref={lastPropertyElementRef}>
                    <PropertyCard property={property} />
                  </Grid>
                );
              } else {
                return (
                  <Grid item xs={12} sm={6} md={4} key={property._id}>
                    <PropertyCard property={property} />
                  </Grid>
                );
              }
            })}
          </Grid>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10
        }}>
        <Fab
          color='primary'
          onClick={() => (window.location.href = '/add-property')}>
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default Properties;
