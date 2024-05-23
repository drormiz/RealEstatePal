import React, { useState } from 'react';
import { Avatar, Typography, Container, Paper, TextField, Button, Input } from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import {getClient, uploadRequest} from '../../../../axios';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useUser();
  const [userInfo, setUserInfo] = useState({
    username: user?.username,
    name: user?.name,
    image: user?.image || 'https://example.com/user-photo.jpg',
  });

  const [imageFile, setImageFile] = useState(null);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);
    let imageUrl = user.image;
        if(imageFile && user?.image !== imageFile){
          const response = await uploadRequest(formData);
        
          imageUrl = response.data.imageUrl;
        }

        await getClient().put(`api/users/${user._id}`, {...user, ...userInfo, image: imageUrl});
        localStorage.setItem('user', JSON.stringify({...user, ...userInfo, image: imageUrl}));
        setUser({...user, ...userInfo});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
      <Input
          id="image-input"
          type="file"
          onChange={handleImageChange}
          inputProps={{ accept: 'image/*' }}
        />
        <Avatar alt={userInfo.username} src={userInfo.image} sx={{ width: 100, height: 100, marginBottom: 2 }} />
        <Typography variant="h4" gutterBottom>
          {userInfo.username}
        </Typography>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userInfo.name}
          onChange={handleChange}
        />
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userInfo.username}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Profile
        </Button>
      </Paper>
    </Container>
  );
};

export default Profile;