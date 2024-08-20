import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Autocomplete,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../../../Providers/UserProvider";
import { purchaseGroupSchema } from "./validationSchema";

const PurchaseGroupForm = ({ onSubmitHandler, properties }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  
  const steps = ['Basic Info', 'Details', 'Property'];

  const { register, handleSubmit, setValue, control, watch } = useForm({
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

  const participationPrice = !!watch('participationPrice') ? watch('participationPrice') :
            !!watch('maxMembersCount') ? properties.find(x => x._id === state.group.property).price/watch('maxMembersCount') : 0

  useEffect(() => {
    if (state?.group) {
      for (const [key, value] of Object.entries(state.group)) {
        setValue(key, value);
      }
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    console.log("Submitted data:", watch());
    setValue("participationPrice", participationPrice)
    let currentId = id;
    if (state?.group) {
      currentId = state.group._id;
    }
    await onSubmitHandler({
      ...watch(),
      owner: user._id,
      _id: currentId,
    });
    navigate("/purchasing-groups");
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !watch("name") || !watch("description");
    } else if (activeStep === 1) {
      return !watch("maxMembersCount") || !watch("profitPercentage");
    } else if (activeStep === 2) {
      return !watch("property");
    }
    return false;
  };

  const isUpdateMode = !!state?.group?._id;
  const isPropertySelected = !!state?.group?.property;

  return (
    <Dialog open={true} onClose={() => navigate("/purchasing-groups")}>
      <DialogTitle>{isUpdateMode ? "Update Purchase Group" : "Create Purchase Group"}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {activeStep === 0 && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    {...register("name")}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    label="Description"
                    {...register("description")}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Grid item xs={12}>
                  <TextField
                    {...register("maxMembersCount")}
                    label="Members Count"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    disabled={isUpdateMode}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("participationPrice")}
                    label={`Participation Price: propery price(${properties.find(x => x._id === state.group.property).price}$), divided by members count`}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    disabled={true}
                    value={participationPrice}
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
                    required
                  />
                </Grid>
              </>
            )}

            {activeStep === 2 && (
              <Grid item xs={12}>
                {isPropertySelected ? (
                  <TextField
                    fullWidth
                    label="Property - cannot be updated"
                    value={
                      properties.find(
                        (property) => property._id === state.group.property
                      )?.name || ""
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      readOnly: isPropertySelected,
                    }}
                    sx={{
                      backgroundColor: isPropertySelected ? "#dddddd" : "inherit",
                    }}
                  />
                ) : (
                  <FormControl fullWidth>
                    <Controller
                      name="property"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <Autocomplete
                          options={properties}
                          getOptionLabel={(option) => option ? option.name : ''}
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
                )}
              </Grid>
            )}

            {/* Hidden inputs to ensure all fields are registered */}
            {activeStep !== 0 && (
              <>
                <input type="hidden" {...register("name")} />
                <input type="hidden" {...register("description")} />
              </>
            )}
            {activeStep !== 1 && (
              <>
                <input type="hidden" {...register("maxMembersCount")} />
                <input type="hidden" {...register("participationPrice")} />
                <input type="hidden" {...register("profitPercentage")} />
              </>
            )}
            {activeStep !== 2 && (
              <input type="hidden" {...register("property")} />
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        {activeStep !== 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            type="submit"
            variant="contained"

            color="primary"
            onClick={handleSubmit(onSubmit)}
            startIcon={isUpdateMode ? <UpdateIcon /> : <AddIcon />}
          >
            {isUpdateMode ? "Update" : "Insert"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseGroupForm;
