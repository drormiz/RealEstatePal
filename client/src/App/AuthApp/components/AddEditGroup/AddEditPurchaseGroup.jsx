import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../Providers/UserProvider";
import { addEditGroupFormSchema } from "./validationSchema";

const PurchaseGroupForm = ({ onSubmitHandler, properties }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const { register, handleSubmit, setValue, control } = useForm({
    resolver: zodResolver(addEditGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      property: "",
    },
  });

  useEffect(() => {
    if (state?.group) {
      for (const [key, value] of Object.entries(state.group)) {
        setValue(key, value);
      }
    } else {
      setValue("name", "");
      setValue("description", "");
      setValue("property", "");
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    let currentId = id;
    if (state?.group) {
      currentId = state.group._id;
    }
    await onSubmitHandler({
      ...data,
      owner: user._id,
      _id: currentId,
    });
    navigate("/purchase-groups-feed");
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
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          {state?.group ? "Update" : "Create"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
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
              <FormControl fullWidth>
                <InputLabel id="property-label">Property</InputLabel>
                <Controller
                  name="property"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="property-label"
                      {...field}
                      label="Property"
                    >
                      {properties
                        .filter(
                          (property) =>
                            property.purchaseGroup === undefined ||
                            property._id === state?.group?.property
                        )
                        .map((property) => (
                          <MenuItem key={property._id} value={property._id}>
                            {property.name} | {property.description}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={state?.group ? <UpdateIcon /> : <AddIcon />}
                sx={{ width: "80%", mt: 2, mb: 2, mx: "auto" }}
              >
                {state?.group ? "Update" : "Insert"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseGroupForm;
