import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import { Button, Typography, Box, FormHelperText } from "@mui/material";

// Register components
import { RegisterTextField } from "../../components/RegisterForms/RegisterTextField";
import { RegisterTextFieldPassword } from "../../components/RegisterForms/RegisterTextFieldPassword";
import { AccountTypeButton } from "../../components/RegisterForms/AccountTypeButton";
interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;

  phone: string;
  address: string;
  zip: string;
  state: string;
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
  state: Yup.string()
    .matches(/^[A-Za-z]{2}$/, "State initials")
    .required("State is required"),
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
    <div className="mt-10 flex flex-col items-center w-full">
      <Typography
        fontWeight="bold"
        component="h2"
        variant="h6"
        style={{ margin: "1rem 0rem 1rem 0rem" }}
      >
        Create an account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="w-9/12">
        <div>
          <Typography className="text-base">
            Name<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-4 mb-4">
            <RegisterTextField
              name="name"
              placeHolder="Name"
              control={control}
              errors={errors.name}
            />
          </div>
        </div>

        <div>
          <Typography className="text-base">
            Contact<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-4">
            <RegisterTextField
              name="email"
              placeHolder="Email address"
              control={control}
              errors={errors.email}
            />
          </div>
          <div className="-mt-3 mb-4">
            <RegisterTextField
              name="phone"
              placeHolder="Phone number"
              control={control}
              errors={errors.phone}
            />
          </div>
        </div>

        <div>
          <Typography className="text-base">
            Password<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-4">
            <RegisterTextFieldPassword
              name="password"
              placeHolder="Create a password"
              control={control}
              errors={errors.password}
            />
          </div>
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
          <div className="-mt-3 mb-4">
            <RegisterTextFieldPassword
              name="confirmPassword"
              placeHolder="Confirm password"
              control={control}
              errors={errors.confirmPassword}
            />
          </div>
        </div>

        <div>
          <Typography className="text-base">
            Address<span className="text-red-500">*</span>
          </Typography>
          <div className="-mt-4 mb-3">
            <RegisterTextField
              name="address"
              placeHolder="Street Address"
              control={control}
              errors={errors.address}
            />
          </div>
          <div className="flex flex-row w-full gap-x-8 -mt-5 mb-4">
            <div className="w-full">
              <RegisterTextField
                name="zip"
                placeHolder="Zip"
                control={control}
                errors={errors.zip}
              />
            </div>
            <div className="w-full">
              <RegisterTextField
                name="state"
                placeHolder="State"
                control={control}
                errors={errors.state}
              />
            </div>
          </div>
        </div>

        <div>
          <Typography className="text-base">Agency (optional)</Typography>
          <div className="-mt-4 mb-4">
            <RegisterTextField
              name="agency"
              placeHolder="Organization/Affiliation"
              control={control}
              errors={errors.agency}
            />
          </div>
        </div>

        <div>
          <Typography className="text-base">
            Account Type<span className="text-red-500">*</span>
          </Typography>
          <Typography className="text-base text-gray-500">
            Choose the account type that most aligns with your needs and
            interactions
          </Typography>

          <Controller
            name="userType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-y-3 mt-3 items-center">
                <AccountTypeButton
                  userType={value}
                  onClick={() => onChange("public donor")}
                  value="public donor"
                />
                <AccountTypeButton
                  userType={value}
                  onClick={() => onChange("corporate donor")}
                  value="corporate donor"
                />
                <AccountTypeButton
                  userType={value}
                  onClick={() => onChange("agency partner")}
                  value="agency partner"
                />
              </div>
            )}
          />
        </div>

        {error && <FormError>{error}</FormError>}

        <div className="mt-14 flex w-full justify-center">
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
        </div>
      </form>

      <Box mt={2}>
        <Typography>
          Already have an account?<span> </span>
          <Link className="font-bold" to="/">
            Log in
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Register;
