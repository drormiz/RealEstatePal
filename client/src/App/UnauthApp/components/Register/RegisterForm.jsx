import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Key, KeyOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Column } from "../../../../Layout";
import { registerUserFn } from "../../../../axios/auth";
import { registerFormSchema } from "./validationSchema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import "./register.css";

const RegisterForm = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(registerFormSchema) });
  const navigate = useNavigate();

  const { mutate: registerUser } = useMutation({
    mutationFn: registerUserFn,
    onSuccess: () => {
      navigate("/login");
      toast.success("Registered User Successfully!");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handlePhoneChange = (value) => {
    setValue("phoneNumber", value);
  };

  return (
    <form onSubmit={handleSubmit(registerUser)}>
      <Column sx={{ gap: 2 }}>
        <TextField
          {...register("name")}
          label="Full Name"
          variant="standard"
          autoFocus
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ""}
          sx={{
            maxWidth: 220,
            "& .MuiFormHelperText-root": {
              maxWidth: 220,
            },
          }}
        />
        <TextField
          {...register("username")}
          label="Username"
          variant="standard"
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ""}
          sx={{
            maxWidth: 220,
            "& .MuiFormHelperText-root": {
              maxWidth: 220,
            },
          }}
        />
        <TextField
          {...register("email")}
          label="Email"
          variant="standard"
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 220,
            "& .MuiFormHelperText-root": {
              maxWidth: 220,
            },
          }}
        />
        <PhoneInput
          {...register("phoneNumber")}
          country={"il"}
          value={""}
          onChange={handlePhoneChange}
          inputProps={{
            name: "phoneNumber",
            required: true,
          }}
          containerClass="phone-input-container"
          inputClass="phone-input"
          buttonClass="phone-input-button"
          dropdownClass="phone-input-dropdown"
        />
        {errors.phoneNumber && (
          <span style={{ color: "#d32f2f", fontSize: "0.75rem", top: "-10px", position: "relative"}}>
            {errors.phoneNumber.message}
          </span>
        )}{" "}
        <TextField
          {...register("password")}
          label="Password"
          variant="standard"
          type={isPasswordShown ? "text" : "password"}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setIsPasswordShown((prev) => !prev)}>
                {isPasswordShown ? <KeyOff /> : <Key />}
              </IconButton>
            ),
          }}
          sx={{
            maxWidth: 220,
            "& .MuiFormHelperText-root": {
              maxWidth: 220,
            },
          }}
        />
        <TextField
          {...register("passwordConfirmation")}
          label="Password Confirmation"
          variant="standard"
          type={isPasswordShown ? "text" : "password"}
          error={!!errors.passwordConfirmation}
          helperText={
            errors.passwordConfirmation
              ? errors.passwordConfirmation.message
              : ""
          }
          sx={{
            maxWidth: 220,
            "& .MuiFormHelperText-root": {
              maxWidth: 220,
            },
          }}
        />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </Column>
    </form>
  );
};

export default RegisterForm;
