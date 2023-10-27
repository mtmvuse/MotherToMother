import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import TextField from "@mui/material/TextField";

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
    control,
    handleSubmit,
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

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      const alal = await login(values.email, values.password);
      navigate("/home"); // Redirect to home page
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...field}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          {isSubmitting ? "Submitting" : "Login"}
        </Button>
      </form>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset</Link>
      </p>
    </div>
  );
};

export default Login;
