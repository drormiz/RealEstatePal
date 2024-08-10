import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import stringToColor from "string-to-color";
import { getClient, uploadRequest } from "../../../../axios";
import UpgradeIcon from "@mui/icons-material/Upgrade";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const Profile = () => {
  const { user, setUser } = useUser();
  const [preview, setPreview] = useState(user.image || "");

  useEffect(() => {
    setPreview(user.image || "");
  }, [user.image]);

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadRequest(formData);
      const imageUrl = response.data.imageUrl;

      await getClient().put(`api/users/${user._id}`, {
        ...user,
        image: imageUrl,
      });

      localStorage.setItem("user", JSON.stringify({ ...user, image: imageUrl }));
      setUser((prevUser) => ({ ...prevUser, image: imageUrl }));
      setPreview(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await getClient().put(`api/users/${user._id}`, user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    await uploadProfileImage(file);
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        style={{ padding: "20px", marginTop: "20px", textAlign: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            height: 200,
            margin: "0 auto",
            marginBottom: 2,
          }}
        >
          <Avatar
            alt={user.username}
            src={preview}
            sx={{
              width: 200,
              height: 200,
              border: "4px solid white",
              boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
              fontSize: "2.5rem",
              bgcolor: preview ? "transparent" : stringToColor(user.name),
            }}
          >
            {!preview && getInitials(user.name)}
          </Avatar>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              borderRadius: "50%",
              border: "2px solid #ddd",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
            <UpgradeIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" gutterBottom>
          {user.username}
        </Typography>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.name}
          onChange={handleChange}
        />
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={user.username}
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
