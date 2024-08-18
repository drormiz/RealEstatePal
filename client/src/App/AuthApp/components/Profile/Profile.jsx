import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Stack,
  IconButton as MuiIconButton
} from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import stringToColor from 'string-to-color';
import { getClient, uploadRequest, updateUser } from '../../../../axios';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const getInitials = name => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

const Profile = () => {
  const { user, setUser } = useUser();
  const [preview, setPreview] = useState(user.image || '');
  const [formState, setFormState] = useState({
    name: user.name || '',
    username: user.username || ''
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setPreview(user.image || '');
  }, [user.image]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getClient().get(
          `api/purchaseGroups/purchaseGroupRequests?userId=${user._id}`
        );
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [user._id]);

  const uploadProfileImage = async file => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadRequest(formData);
      const imageUrl = response.data.imageUrl;
      const updatedUser = await updateUser(user._id, { image: imageUrl });
      setUser(updatedUser.data);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setPreview(updatedUser.data.image);
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      window.location.reload();
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    }
  };

  const handleUpdate = async () => {
    try {
      const localUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = await updateUser(user._id, {
        name: formState.name,
        username: formState.username
      });
      setUser(updatedUser.data);
      localStorage.setItem('user', JSON.stringify(updatedUser.data));
      toast.success('Profile updated successfully!');
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 404)
      ) {
        console.error(
          'Error updating user profile:',
          error.response.data.error
        );
        toast.error(error.response.data.error);
      }
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState(prevFormState => ({
      ...prevFormState,
      [name]: value
    }));
  };

  const handleImageChange = async event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    await uploadProfileImage(file);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordChange = event => {
    const { name, value } = event.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      const updatedUser = await updateUser(user._id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (updatedUser) {
        toast.success('Password changed successfully');
        setPasswordDialogOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setUser(updatedUser.data);
        localStorage.setItem('user', JSON.stringify(updatedUser.data));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to change password');
      }
    }
  };

  return (
    <Stack
      fullWidth
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
      spacing={1}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto',
          maxHeight: '300px'
        }}>
        <Avatar
          alt={user.username}
          src={preview}
          sx={{
            width: '100%',
            height: 'auto',
            border: '4px solid white',
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            fontSize: '2.5rem',
            bgcolor: preview ? 'transparent' : stringToColor(user.name)
          }}>
          {!preview && getInitials(user.name)}
        </Avatar>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='label'
          sx={{
            position: 'absolute',
            bottom: 30,
            right: 8,
            bgcolor: 'white',
            borderRadius: '50%',
            border: '2px solid #ddd',
            '&:hover': {
              bgcolor: '#f5f5f5'
            },
            width: 40,
            height: 40
          }}>
          <input
            hidden
            accept='image/*'
            type='file'
            onChange={handleImageChange}
          />
          <UpgradeIcon />
        </IconButton>
      </Box>

      <Stack flex={1} sx={{ width: '50%' }}>
        <Typography variant='h4' gutterBottom>
          {user.username}
        </Typography>
        <TextField
          label='Name'
          name='name'
          variant='outlined'
          fullWidth
          margin='normal'
          value={formState.name}
          onChange={handleChange}
        />
        <TextField
          label='Username'
          name='username'
          variant='outlined'
          fullWidth
          margin='normal'
          value={formState.username}
          onChange={handleChange}
        />
        <Stack direction='row' sx={{ justifyContent: 'center' }} spacing={2}>
          <Button
            variant='contained'
            color='primary'
            sx={{ borderRadius: '25px' }}
            onClick={handleUpdate}>
            Update Profile
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{ borderRadius: '25px' }}
            onClick={() => setPasswordDialogOpen(true)}>
            Change Password
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Profile;
