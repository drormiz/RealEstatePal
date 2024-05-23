import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, TextField, Button, Grid, Input, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import { useUser } from '../../contexts/UserContext';
import { addEditGroupFormSchema } from './validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';


const PurchaseGroupForm = ({ value = null, onSubmitHandler }) => {
  const {user} = useUser();
  const { register, handleSubmit, setValue, reset, watch } = useForm({ resolver: zodResolver(addEditGroupFormSchema) });

  const onSubmit = async (data) => {
    await onSubmitHandler({
      ...data,
      owner: user._id,
    });
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', height: '100%', overflow: 'auto',boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          {value ? 'Update' : 'Create '}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                {...register('name')}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                {...register('description')}
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={value ? <UpdateIcon /> : <AddIcon />}
                sx={{ width: '80%', mt: 2, mb: 2, mx: 'auto' }}
              >
                {value ? 'Update' : 'Insert'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseGroupForm;
