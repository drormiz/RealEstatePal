import { Stack, Typography } from '@mui/material';

const EmptyRequets = () => (
  <Stack
    sx={{ height: '100%' }}
    alignItems={'center'}
    justifyContent={'center'}>
    <Typography variant='h3' color='textSecondary'>
      You have no requests at the moment.
    </Typography>
  </Stack>
);

export default EmptyRequets;
