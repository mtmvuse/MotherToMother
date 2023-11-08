import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./ForgotPassword.css";
import forgotpasswordlogo from "../assets/forgotpassword-logo.png";

interface FormValues {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword: React.FC = () => {
  const { forgotPassword, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      console.log("forgetpassword", currentUser);
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

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      await forgotPassword(values.email);
      setMessage("Check your email for further instructions");
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      setError(err.message);
    }
  };

  return (
    <div className={"forgot-password-container"}>
      <img className="forgot-logo-image" src={forgotpasswordlogo} alt="Image1" />
      <Typography className="heading">Forgot your password?</Typography>
      <div className={"forgot-password-form"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={"input-container"}>
            <p className={"info-text"}>
              Enter your email below and receive your password reset instructions
            </p>
            <input
              type="email"
              placeholder="Email"
              className={`user-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}

            {error && <FormError>{error}</FormError>}
            <button className="reset-button">
              {isSubmitting ? "Submitting" : "Reset Password"}
            </button>
          </div>
        </form>
      </div>

      <div className={"signup-container"}>
        <Typography>
          <Link to="/" className={"link"}>
            Already have an account? Log in
          </Link>
        </Typography>
        <Typography>
          <Link to="/register" className={"link"}>
            Don't have an account?
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default ForgotPassword;
