import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { PurchaseGroupRequestSchema } from "./validationSchema";
import { getClient } from "../../../../axios";

const JoinPurchaseGroupForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PurchaseGroupRequestSchema),
    defaultValues: {
      priceToInvest: "",
      description: "",
    },
  });

  useEffect(() => {
    if (state?.group) {
      setValue("group", state.group._id);
    }
  }, [state, setValue]);

  const { mutate: submitGroupRequest } = useMutation({
    mutationFn: async (data) => {
      data["group"] = state.group._id;
      return await getClient().post(
        "api/purchaseGroups/purchaseGroupRequest",
        data
      );
    },
    onSuccess: () => {
      toast.success("Group request submitted successfully!");
      navigate("/purchase-groups-feed");
    },
    onError: (error) => {
      toast.error(
        `Error submitting group request: ${
          error.response?.data.error || error.message
        }`
      );
    },
  });

  const onSubmit = (data) => {
    submitGroupRequest(data);
  };

  const groupName = state?.group?.name || "this group";

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
          {`Join ${groupName} purchase group`}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("group")} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                {...register("priceToInvest", { valueAsNumber: true })}
                InputLabelProps={{ shrink: true }}
                placeholder="Investing Amount *"
                error={!!errors.priceToInvest}
                helperText={
                  errors.priceToInvest ? errors.priceToInvest.message : ""
                }
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                {...register("description")}
                InputLabelProps={{ shrink: true }}
                placeholder="Request Description *"
                error={!!errors.description}
                helperText={
                  errors.description ? errors.description.message : ""
                }
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "80%", mt: 2, mb: 2, mx: "auto" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinPurchaseGroupForm;
