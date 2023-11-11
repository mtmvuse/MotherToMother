import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import { TextField, Button, Typography, Box } from "@mui/material";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  userType: Yup.string().required("Type is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const Register: React.FC = () => {
  const { registerUser, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      await registerUser(
        values.lastName,
        values.email,
        values.password,
        values.userType,
      );
      navigate("/home");
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      setError(err.message);
    }
  };

  return (
    <div>
      <Typography component="h2" variant="h6">
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              label="First Name"
              type="text"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ""}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              label="Last Name"
              type="text"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ""}
            />
          )}
        />
        <Controller
          name="userType"
          control={control}
          render={({ field }) => (
            <TextField
              label="User Type"
              type="text"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.userType}
              helperText={errors.userType ? errors.userType.message : ""}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...field}
              error={!!errors.confirmPassword}
              helperText={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
            />
          )}
        />
        {error && <FormError>{error}</FormError>}
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {isSubmitting ? "Submitting" : "Register"}
        </Button>
      </form>
      <Box mt={2}>
        <Typography>
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Register;
