import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Paper,
  Grid,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../Providers/UserProvider";
import { addEditPropertyFormSchema } from "./validationSchema";
import { uploadRequest } from "../../../../axios";
import { propertyType } from "../../consts/property-type.const";
import LocationPicker from "./LocationPicker";

const PropertyBaseForm = ({ property = null, onSubmitHandler }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addEditPropertyFormSchema) });
  const [selectedImages, setSelectedImages] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);
  const [location, setLocation] = useState({
    latitude: property?.latitude || null,
    longitude: property?.longitude || null,
  });

  const isPropertyOwnedUser = property?.owner === user._id;

  useEffect(() => {
    if (property) {
      Object.entries(property).forEach(([key, value]) => {
        setValue(key, value);
      });

      setLocation({
        latitude: property.latitude,
        longitude: property.longitude,
      });

      setPropertyImages(property.images);
    }
  }, [property, setValue]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (url) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img) => img.url !== url)
    );
  };

  const handleRemovePropertyImage = (url) => {
    setPropertyImages((prevImages) => prevImages.filter((img) => img !== url));
  };

  const uploadImages = async (images) => {
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageFormData = new FormData();
        imageFormData.append("image", image.file);
        const response = await uploadRequest(imageFormData);
        return response.data.imageUrl;
      })
    );
    return imageUrls;
  };

  const onSubmit = async (data) => {
    try {
      const imageUrls = await uploadImages(selectedImages);
      const formData = {
        ...data,
        images: [...imageUrls, ...propertyImages],
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await onSubmitHandler({
        ...formData,
        username: user.username,
        userId: user._id,
        owner: user._id,
        _id: property?._id,
      });

      navigate("/properties");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Paper
        sx={{
          padding: "20px",
          margin: "50px",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("name")}
                label="Property Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name ? "Name is required" : ""}
              />
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("price")}
                label="Price ($)"
                type="number"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                error={!!errors.price}
                helperText={errors.price ? "Price is required" : ""}
              />
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("meters")}
                label="Size (sq. meters)"
                type="number"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                error={!!errors.meters}
                helperText={errors.meters ? "Size is required" : ""}
              />
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("numberOfRooms")}
                label="Number of Rooms"
                type="number"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                error={!!errors.numberOfRooms}
                helperText={
                  errors.numberOfRooms ? "Number of rooms is required" : ""
                }
              />
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("floor")}
                label="Floor"
                type="number"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                error={!!errors.floor}
                helperText={errors.floor ? "Floor is required" : ""}
              />
              <FormControl fullWidth>
                <InputLabel id="property-type-label">Property Type</InputLabel>
                <Select
                  disabled={property && !isPropertyOwnedUser}
                  {...register("propertyType")}
                  labelId="property-type-label"
                  label="Property Type"
                  variant="outlined"
                  error={!!errors.propertyType}
                  defaultValue={property?.propertyType || ""}
                >
                  {Object.keys(propertyType).map((key) => (
                    <MenuItem key={key} value={propertyType[key]}>
                      {propertyType[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                disabled={property && !isPropertyOwnedUser}
                {...register("description")}
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                error={!!errors.description}
                helperText={errors.description ? "Description is required" : ""}
              />
              <LocationPicker
                setLocation={(location) => {
                  setValue("latitude", location.latitude);
                  setValue("longitude", location.longitude);
                  setLocation(location);
                }}
                initialLocation={{
                  latitude: property?.latitude || null,
                  longitude: property?.longitude || null,
                }}
              />
              {errors.latitude && (
                <Typography color="error">{errors.latitude.message}</Typography>
              )}
              <label style={{ fontSize: "large" }}>
                <input
                  style={{ width: "20px", height: "20px" }}
                  type="checkbox"
                  {...register("hasElevator")}
                  disabled={property && !isPropertyOwnedUser}
                />
                Is there an elevator?
              </label>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                sx={{ textDecoration: "underline" }}
                variant="h4"
                gutterBottom
              >
                Property Images
              </Typography>
              {!(property && !isPropertyOwnedUser) && (
                <>
                  <input
                    disabled={property && !isPropertyOwnedUser}
                    {...register("images")}
                    accept="image/*"
                    id="upload-images"
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="upload-images">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<PhotoCamera />}
                    >
                      Upload Images
                    </Button>
                  </label>
                </>
              )}
              <Grid
                sx={{ height: "400px", overflow: "auto" }}
                container
                spacing={2}
              >
                {selectedImages.map((image, index) => (
                  <Grid item key={index} xs={4}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "120px",
                        backgroundImage: `url(${image.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {!(property && !isPropertyOwnedUser) && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(255, 0, 0, 0.7)",
                            color: "white",
                          }}
                          onClick={() => handleRemoveImage(image.url)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}
                {propertyImages.map((image, index) => (
                  <Grid item key={index} xs={4}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "120px",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {!(property && !isPropertyOwnedUser) && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(255, 0, 0, 0.7)",
                            color: "white",
                          }}
                          onClick={() => handleRemovePropertyImage(image)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
        {!(property && !isPropertyOwnedUser) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              {property ? "Update property" : "Add property"}
            </Button>
          </Box>
        )}
      </Paper>
    </form>
  );
};

export default PropertyBaseForm;
