import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Tooltip,
} from "@mui/material";

import { RegisterTextField } from "../../../src/components/RegisterForms/ui/RegisterTextField";
import m2mLogo from "../assets/m2m_logo.png";
import m2mAnimalLogo from "../assets/animal_logo.png";
import { FilePresent } from "@mui/icons-material";

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
    <div className="m-10 flex flex-col items-center">
      <img
        className="mb-8 mt-3"
        src={m2mLogo}
        alt="Mother to Mother Logo"
        title="mother to mother"
      />
      <Typography fontWeight="bold" component="h2" variant="h6">
        Create an account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Typography variant="subtitle2">
            Name<span className="text-red-500">*</span>
          </Typography>

          <div className="flex flex-row gap-x-2 -mt-3">
            <RegisterTextField
              name="firstName"
              placeHolder="First Name"
              control={control}
              errors={errors.firstName}
            />

            <RegisterTextField
              name="lastName"
              placeHolder="Last Name"
              control={control}
              errors={errors.lastName}
            />
          </div>
        </div>
        <div>
          <Typography variant="subtitle2">
            User Type<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-3">
            <Controller
              name="userType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    value={value || ""} // Use the value from the field prop
                    onChange={onChange} // Use the onChange from the field prop
                    style={{ border: "none", borderRadius: "100px" }}
                    required
                  >
                    <Tooltip title="Information about what an Agency Partner means">
                      <MenuItem value="Agency Partner">Agency Partner</MenuItem>
                    </Tooltip>
                    <Tooltip title="Information about what a Corporation Donor means">
                      <MenuItem value="Corporation/Foundation Donor">
                        Corporation/Foundation Donor
                      </MenuItem>
                    </Tooltip>
                    <Tooltip title="Information about what a Public Donor means">
                      <MenuItem value="Public Donor">Public Donor</MenuItem>
                    </Tooltip>
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </div>

        <div>
          <Typography variant="subtitle2">
            Email<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-3">
            <RegisterTextField
              name="email"
              placeHolder="Enter your email"
              control={control}
              errors={errors.email}
            />
          </div>
        </div>
        <div>
          <Typography variant="subtitle2">
            Password<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-3">
            <RegisterTextField
              name="password"
              placeHolder="Create a password"
              control={control}
              errors={errors.password}
            />
          </div>
          <div className="-mt-3">
            <RegisterTextField
              name="confirmPassword"
              placeHolder="Confirm password"
              control={control}
              errors={errors.confirmPassword}
            />
          </div>
        </div>
        {error && <FormError>{error}</FormError>}

        <div className="mt-6 flex w-full justify-center">
          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
            style={{ borderRadius: "100px", width: "75%", fontSize: "1.1rem" }}
          >
            Sign Up
            {/* {isSubmitting ? "Submitting" : "Register"} */}
          </Button>
        </div>
      </form>

      <Box mt={2}>
        <Typography>
          Already have an account?{" "}
          <Link className="font-bold" to="/">
            Log in
          </Link>
        </Typography>
      </Box>

      <img src={m2mAnimalLogo} alt="mother to mother animal logo" />
    </div>
  );
};

export default Register;
