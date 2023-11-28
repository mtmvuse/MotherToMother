import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import {
  Button,
  Typography,
  Box,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

// Register components
import { RegisterTextField } from "../../components/RegisterForms/RegisterTextField";
import { RegisterTextFieldPassword } from "../../components/RegisterForms/RegisterTextFieldPassword";
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;

  phone: string;
  address: string;
  zip: string;
  city: string;
  agency?: string;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^([A-Za-z]+\s[A-Za-z]+)$/, "First and Last name")
    .required("First and Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
      "Invalid password",
    )
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  userType: Yup.string().required("Type is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid Zip code")
    .required("Zip code is required"),
  city: Yup.string().required("City is required"),
  agency: Yup.string(),
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
        values.name,
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
    <Box
      mt={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      <Typography
        fontWeight="bold"
        component="h2"
        variant="h6"
        style={{ margin: "1rem 0rem 1rem 0rem" }}
      >
        Create an account
      </Typography>

      <Box width="75%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography variant="body1">
              Name<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2} mb={2}>
              <RegisterTextField
                name="name"
                placeHolder="Name"
                control={control}
                errors={errors.name}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body1">
              Contact<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2}>
              <RegisterTextField
                name="email"
                placeHolder="Email address"
                control={control}
                errors={errors.email}
              />
            </Box>
            <Box mt={-1.5} mb={2}>
              <RegisterTextField
                name="phone"
                placeHolder="Phone number"
                control={control}
                errors={errors.phone}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body1">
              Password<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2}>
              <RegisterTextFieldPassword
                name="password"
                placeHolder="Create a password"
                control={control}
                errors={errors.password}
              />
            </Box>
            <FormHelperText
              sx={{
                fontWeight: "bold",
                marginTop: "-0.05rem",
                color: "grey",
                opacity: "50%",
                fontSize: "0.6rem",
              }}
            >
              at least one number and one special character
            </FormHelperText>
            <Box mt={-1.5} mb={2}>
              <RegisterTextFieldPassword
                name="confirmPassword"
                placeHolder="Confirm password"
                control={control}
                errors={errors.confirmPassword}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body1">
              {" "}
              Address<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2} mb={1.5}>
              <RegisterTextField
                name="address"
                placeHolder="Street Address"
                control={control}
                errors={errors.address}
              />
            </Box>
            <Box
              mt={-2.5}
              mb={2}
              display="flex"
              flexDirection="row"
              width="100%"
              gap={4}
            >
              <Box width="100%">
                <RegisterTextField
                  name="city"
                  placeHolder="City"
                  control={control}
                  errors={errors.city}
                />
              </Box>

              <Box width="100%">
                <RegisterTextField
                  name="zip"
                  placeHolder="Zip"
                  control={control}
                  errors={errors.zip}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="body1">Agency (optional)</Typography>
            <Box mt={-2} mb={2}>
              <RegisterTextField
                name="agency"
                placeHolder="Organization/Affiliation"
                control={control}
                errors={errors.agency}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body1">
              Account Type<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Typography variant="body1" color="grey.500">
              Choose the account type that most aligns with your needs and
              interactions
            </Typography>

            <Controller
              name="userType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth variant="standard">
                  <Select
                    value={value || ""}
                    onChange={onChange}
                    style={{
                      border: "none",
                      borderRadius: "100px",
                      color: "black",
                    }}
                    error={!!errors.userType}
                  >
                    <MenuItem value="Public Donor">Public Donor</MenuItem>

                    <MenuItem value="Corporation/Foundation Donor">
                      Corporation/Foundation Donor
                    </MenuItem>

                    <MenuItem value="Agency Partner">Agency Partner</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.userType ? (
                      <span style={{ color: "#d32f2f" }}>
                        {errors.userType.message}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>

          {error && <FormError>{error}</FormError>}

          <Box
            mt={7}
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
          >
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="contained"
              size="small"
              style={{
                borderRadius: "100px",
                width: "70%",
                fontSize: "1.3rem",
                textTransform: "none",
                backgroundColor: "rgb(229 231 235)",
                color: "black",
              }}
            >
              {isSubmitting ? "Signing in" : "Sign up"}
            </Button>
          </Box>
        </form>
      </Box>

      <Box mt={2}>
        <Typography>
          Already have an account?<span> </span>
          <Link style={{ fontWeight: "bold" }} to="/">
            Log in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
