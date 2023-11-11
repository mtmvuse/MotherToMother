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
import paperAirplane from "../assets/paperPlanelogo.png";
import ForgotPasswordModal from "../../components/Auth/ForgotPasswordModal";
import "../../components/Auth/ForgotPasswordModal.css"


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
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const[open, setOpen] = useState<boolean>(false);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      await forgotPassword(values.email);
      setOpen(true)
    } catch (err: any) {
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
              {...forgotPassword("email")}
              className={`user-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}

            {error && <FormError>{error}</FormError>}
            <button className="reset-button" type = "submit">
              {isSubmitting ? "Submitting" : "Reset Password"}
            </button>
            {/*Button to test popup Modal /!*<button onClick={()=> setOpen(true)}>Modal Test</button>*!/*/}
          </div>
        </form>
      </div>

      <div className={"signup-container"}>
        <Typography>
          <Link to="/" className={"link"}>
            Already have an account? Log in
          </Link>
        </Typography>
      </div>
      <ForgotPasswordModal open={open} onClose={() => setOpen(false)}>
        <div className={"popup"}>
          <img src={paperAirplane} alt="Image1" />
          <h2 className={"heading"}>
            Reset Instructions sent!
          </h2>
          <p className={"instructions-text"}>
            An email with instructions to reset your email was sent to you inbox
          </p>
          <Typography>
            <Link to="/" className={"link"}>
              back to login
            </Link>
          </Typography>
        </div>
      </ForgotPasswordModal>
    </div>
  );
};

export default ForgotPassword;
