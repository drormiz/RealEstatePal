import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Container,
  TextField,
  Button,
  IconButton,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton as MuiIconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import stringToColor from "string-to-color";
import { getClient, uploadRequest, updateUser } from "../../../../axios";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [requests, setRequests] = useState([]);
  const [formState, setFormState] = useState({
    name: user.name || "",
    username: user.username || "",
  });
  const [open, setOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setPreview(user.image || "");
  }, [user.image]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getClient().get(
          `api/purchaseGroups/purchaseGroupRequests?userId=${user._id}`
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [user._id]);

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadRequest(formData);
      const imageUrl = response.data.imageUrl;
      const updatedUser = await updateUser(user._id, { image: imageUrl });
      setUser(updatedUser.data);
      setPreview(updatedUser.data.image);
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateUser(user._id, {
        name: formState.name,
        username: formState.username,
      });
      setUser(updatedUser.data);
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        console.error("Error updating user profile:", error.response.data.error);
        toast.error(error.response.data.error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevFormState) => ({
      ...prevFormState,
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
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await getClient().delete(
        `api/purchaseGroups/purchaseGroupRequest/${requestId}`
      );
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );
      toast.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Failed to delete request.");
    }
  };

  const handleClickDelete = (requestId) => {
    setDeleteRequestId(requestId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDeleteRequestId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteRequestId) {
      handleDeleteRequest(deleteRequestId);
    }
    handleCloseDialog();
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      const updatedUser = await updateUser(user._id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (updatedUser) {
        toast.success("Password changed successfully");
        setPasswordDialogOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setUser(updatedUser.data);
        localStorage.setItem("user", JSON.stringify(updatedUser.data));
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to change password");
      }
    }
  };

  const renderProperty = (label, value) => (
    <Typography variant="body2" color="textSecondary">
      {label}:{" "}
      <Typography variant="body1" component="span" color="textPrimary">
        {value}
      </Typography>
    </Typography>
  );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
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
                value={formState.name}
                onChange={handleChange}
              />
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formState.username}
                onChange={handleChange}
              />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Update Profile
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                My Purchase Group Requests
              </Typography>
              <Box
                sx={{
                  maxHeight: "calc(100vh - 250px)",
                  overflowY: "auto",
                }}
              >
                {requests.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    You have no requests at the moment.
                  </Typography>
                ) : (
                  requests.map((request) => (
                    <Card
                      key={request._id}
                      variant="outlined"
                      style={{ marginBottom: "20px" }}
                    >
                      <CardHeader
                        action={
                          <MuiIconButton
                            edge="end"
                            color="default"
                            onClick={() => handleClickDelete(request._id)}
                            sx={{
                              marginRight: 0,
                              color: "gray",
                              "&:hover": {
                                color: "darkgray",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </MuiIconButton>
                        }
                        title={`Group Name: ${request.group?.name || "Loading..."
                          }`}
                        subheader={
                          <>
                            {request.status === "pending" && (
                              <>
                                <HourglassEmptyIcon
                                  style={{
                                    verticalAlign: "middle",
                                    marginRight: "8px",
                                    color: "orange",
                                  }}
                                />
                                {request.status}
                              </>
                            )}
                            {request.status === "approved" && (
                              <>
                                <CheckCircleOutlineIcon
                                  style={{
                                    verticalAlign: "middle",
                                    marginRight: "8px",
                                    color: "green",
                                  }}
                                />
                                {request.status}
                              </>
                            )}
                            {request.status === "rejected" && (
                              <>
                                <HighlightOffIcon
                                  style={{
                                    verticalAlign: "middle",
                                    marginRight: "8px",
                                    color: "red",
                                  }}
                                />
                                {request.status}
                              </>
                            )}
                          </>
                        }
                      />
                      <CardContent>
                        {renderProperty(
                          "Request Description",
                          request.description
                        )}
                        {renderProperty(
                          "Price to Invest",
                          `$${request.priceToInvest}`
                        )}
                      </CardContent>
                      <Divider />
                      <CardContent></CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="delete-request-dialog-title"
      >
        <DialogTitle id="delete-request-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
        aria-labelledby="change-password-dialog-title"
      >
        <DialogTitle id="change-password-dialog-title">
          Change Password
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
