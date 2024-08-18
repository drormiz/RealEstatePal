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
  FormControl,
  Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../Providers/UserProvider";
import { purchaseGroupSchema } from "./validationSchema";

const PurchaseGroupForm = ({ onSubmitHandler, properties }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const { register, handleSubmit, setValue, control } = useForm({
    resolver: zodResolver(purchaseGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      property: "",
      maxMembersCount: "",
      participationPrice: "",
      profitPercentage: "",
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
      setValue("maxMembersCount", "");
      setValue("participationPrice", "");
      setValue("profitPercentage", "");
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
    navigate("/purchasing-groups");
  };

  const isUpdateMode = !!state?.group?._id;
  const isPropertySelected = !!state?.group?.property;

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
          {isUpdateMode ? "Update" : "Create"}
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
              <TextField
                  {...register("maxMembersCount")}
                  label="Max Members Count"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                  {...register("participationPrice")}
                  label="Participation Price"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                  {...register("profitPercentage")}
                  label="Profit Percentage"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12}>
              {isPropertySelected ? (
                <TextField
                  fullWidth
                  label={
                    isPropertySelected ? "Property - cannot be updated" : "Property"
                  }
                  value={
                    isPropertySelected
                      ? properties.find(
                          (property) => property._id === state.group.property
                        )?.name || ""
                      : ""
                  }
                  InputLabelProps={{ shrink: true }}
                  placeholder="Property"
                  InputProps={{
                    readOnly: isPropertySelected, 
                  }}
                  sx={{
                    backgroundColor: isPropertySelected ? "#dddddd" : "inherit",
                  }}
                />
              ) : 
                (
                  <FormControl fullWidth>
                    <Controller
                      name="property"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Autocomplete
                          options={properties}
                          getOptionLabel={(option) =>
                            option ? option.name : ''
                          }
                          isOptionEqualToValue={(option, value) => option._id === value}
                          onChange={(_, data) => onChange(data ? data._id : '')}
                          value={properties.find((property) => property._id === value) || null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Property"
                              variant="outlined"
                              inputRef={ref}
                            />
                          )}
                        />
                    )}
                  />
                </FormControl>
              )
              }
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isUpdateMode ? <UpdateIcon /> : <AddIcon />}
                sx={{ width: "80%", mt: 2, mb: 2, mx: "auto" }}
              >
                {isUpdateMode ? "Update" : "Insert"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseGroupForm;
