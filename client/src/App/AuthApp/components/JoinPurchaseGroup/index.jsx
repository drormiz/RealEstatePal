import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { PurchaseGroupRequestSchema } from "./validationSchema";
import { getClient } from "../../../../axios";
import CloseIcon from "@mui/icons-material/Close";

const JoinPurchaseGroupForm = ({ isOpen, group, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PurchaseGroupRequestSchema),
    defaultValues: {
      priceToInvest: +group?.participationPrice,
      description: "",
    },
  });

  useEffect(() => {
    setValue("priceToInvest", +group?.participationPrice)
    if (group) {
      setValue("group", group._id);
    }
  }, [group, setValue]);

  // Reset form fields when the dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset(); // This will clear the form when the dialog is closed
    }
  }, [isOpen, reset]);

  const { mutate: submitGroupRequest } = useMutation({
    mutationFn: async (data) => {
      data["group"] = group?._id;
      return await getClient().post(
        "api/purchaseGroups/purchaseGroupRequest",
        data
      );
    },
    onSuccess: () => {
      toast.success("Group request submitted successfully!");
      onClose();
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

  const groupName = group?.name || "this group";

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {`Join ${groupName} Purchase Group`}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <input type="hidden" {...register("group")} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <TextField
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
              /> */}
               <Typography
                fullWidth
                // {...register("priceToInvest", { valueAsNumber: true })}
                InputLabelProps={{ shrink: true }}
                placeholder="Investing Amount *"
              >
                Investing Amount: {group?.participationPrice}$
                </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description "
                {...register("description")}
                InputLabelProps={{ shrink: true }}
                placeholder="why you want to join this group..."
                error={!!errors.description}
                helperText={
                  errors.description ? errors.description.message : ""
                }
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JoinPurchaseGroupForm;
