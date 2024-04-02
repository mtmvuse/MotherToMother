import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../../contexts/AuthContext";
import { Typography } from "@mui/material";
import FormError from "../FormError";
import "./Login.css";
import m2m_logo from "../../assets/m2m_logo.png";
import animal_logo from "../../assets/animal_logo.png";

interface FormValues {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      setError("");
      await login(data.email, data.password);
      navigate("/home");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className={"login-container"}>
      <img className="logo-image" src={m2m_logo} alt="Image1" />
      <Typography className={"heading"}>Log In</Typography>
      <div
        className="login-form-container"
        style={{ background: "transparent" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={"input-container"}>
            <input
              type="email"
              placeholder="Email or Username"
              {...register("email")}
              className={`user-input ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className={"input-container"}>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`user-input ${errors.password ? "error" : ""}`}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
          {error && <FormError>{error}</FormError>}

          <div className={"signup-container"}>
            <Typography>
              <Link to="/forgotPassword" className={"link"}>
                Forgot Password?
              </Link>
            </Typography>
          </div>

          <div className={"input-container"}>
            <button className="login-button" type="submit" color="primary">
              {isSubmitting ? "Submitting" : "LOGIN"}
            </button>
            <Typography>
              <Link
                to="/register"
                style={{
                  color: "gray",
                  textDecoration: "none",
                  fontFamily: "Raleway, sans-serif",
                  fontSize: "15px",
                }}
              >
                <span style={{ fontWeight: "normal" }}>
                  Don't have an account?
                </span>
                <span style={{ fontWeight: "bold" }}> Sign up</span>
              </Link>
            </Typography>
          </div>
        </form>
      </div>
      <img
        style={{ zIndex: -1 }}
        className="animal-image"
        src={animal_logo}
        alt="Image1"
      />
    </div>
  );
};

export default Login;
