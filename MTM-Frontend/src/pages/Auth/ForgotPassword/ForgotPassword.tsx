import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../../contexts/AuthContext";
import { Typography } from "@mui/material";
import "./ForgotPassword.css";
import forgotpasswordlogo from "../../assets/forgotpassword-logo.png";
import paperAirplane from "../../assets/paperPlanelogo.png";
import ForgotPasswordModal from "../../../components/Auth/ForgotPasswordModal/ForgotPasswordModal";
import { RegisterTextField } from "../../../components/Auth/RegisterForms/RegisterTextField";

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
      navigate("/home");
    }
  }, [currentUser, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = async (data: FormValues) => {
    try {
      setError("");
      await forgotPassword(data.email);
      setOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={"forgot-password-container"}>
      <img
        src={forgotpasswordlogo}
        alt="Image1"
        className="forgot-logo-image"
      />
      <Typography className="heading">Forgot your password?</Typography>
      <div className={"forgot-password-form"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={"input-container"}>
            <p className={"info-text"}>
              Enter your email below and receive your password reset
              instructions
            </p>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`user-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}

            {error && <p className="error-message">{error}</p>}
            <button
              className="reset-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "RESET PASSWORD"}
            </button>
          </div>
        </form>
      </div>

      <div className={"signup-container"}>
        <Typography
          style={{ fontFamily: "Raleway, sans-serif", fontWeight: "400" }}
        >
          <Link to="/" style={{ color: "gray", textDecoration: "none" }}>
            <span style={{ fontWeight: "normal" }}>
              Already have an account?
            </span>
            <span style={{ fontWeight: "bold" }}> Log in</span>
          </Link>
        </Typography>
      </div>
      <ForgotPasswordModal open={open} onClose={() => setOpen(false)}>
        <div className={"popup"}>
          <img src={paperAirplane} alt="Image1" />
          <h2 className={"heading"}>Reset Instructions sent!</h2>
          <p className={"instructions-text"}>
            An email with instructions to reset your password was sent to your
            inbox.
          </p>
          <Typography
            style={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: "400",
              color: "var(--mtmNavy)",
            }}
          >
            <Link
              to="/ "
              style={{ color: "var(--mtmNavy)", textDecoration: "none" }}
            >
              Back to login
            </Link>
          </Typography>
        </div>
      </ForgotPasswordModal>
    </div>
  );
};

export default ForgotPassword;
