import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../Providers/UserProvider";
import { addEditPropertyFormSchema } from "./validationSchema";
import { uploadRequest } from "../../../../axios";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const PropertyForm = ({ property = null, onSubmitHandler }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const handleImageChange = (event) => {
    setValue("image", event.target.files[0]);
  };

  const getImageSrc = () => {
    if (!!property && image === property.image) {
      return property.image;
    }
    if (!!image) {
      return URL.createObjectURL(image);
    }
  };

  const { register, handleSubmit, setValue, watch } = useForm({
    resolver: zodResolver(addEditPropertyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const image = watch("image");

  useEffect(() => {
    if (property) {
      for (const [key, value] of Object.entries(property)) {
        setValue(key, value);
      }
    } else {
      setValue("name", "");
      setValue("description", "");
      setValue("price", "");
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    const imageFormData = new FormData();
    imageFormData.append("image", image);

    try {
      let imageUrl = property ? property.image : "";
      if (image && property?.image !== image) {
        const response = await uploadRequest(imageFormData);

        imageUrl = response.data.imageUrl;
      }

      await onSubmitHandler({
        ...data,
        username: user.username,
        userId: user._id,
        owner: user._id,
        image: imageUrl,
        _id: property?._id,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "auto",
        height: "100%",
        overflow: "auto",
        boxShadow: 4,
      }}
    >
      <CardContent sx={{ height: "200px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <div style={{ marginTop: "20px", marginLeft: "95px" }}>
              {image && (
                <img
                  src={getImageSrc()}
                  alt="Uploaded Image"
                  style={{ maxWidth: "100%", maxHeight: "300px" }}
                />
              )}
            </div>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                {...register("name")}
                InputLabelProps={{ shrink: true }}
                placeholder="Name *"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                {...register("description")}
                InputLabelProps={{ shrink: true }}
                placeholder="Description *"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                fullWidth
                label="Price"
                {...register("price", { required: true, valueAsNumber: true })}
                InputLabelProps={{ shrink: true }}
                placeholder="Price *"
                required
                defaultValue={""}
              />
            </Grid>
            <Grid sx={{ margin: "20px" }}>
              <IconButton variant="contained" component="label" sx={{ mb: 2 }}>
                Add Photo +
                <input
                  hidden
                  type="file"
                  {...register("image")}
                  onChange={handleImageChange}
                  style={{
                    marginRight: "100px",
                    marginLeft: "100px",
                    marginBottom: "10px",
                  }}
                />
                <PhotoCamera />
              </IconButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={state?.property ? <UpdateIcon /> : <AddIcon />}
                sx={{ width: "80%", mt: 2, mb: 2, mx: "auto" }}
              >
                {state?.property ? "Update" : "Insert"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
