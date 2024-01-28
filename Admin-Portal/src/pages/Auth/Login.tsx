import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../lib/contexts";
import { Box, TextField, Button } from "@mui/material";
import FormError from "./FormError";
import { DEFAULT_PAGE } from "../../lib/constants";

interface FormValues {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Login: React.FC = () => {
  const { currentUser, sendLoginEmail } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      navigate(DEFAULT_PAGE);
    }
  }, [currentUser, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      await sendLoginEmail(values.email);
      navigate(DEFAULT_PAGE);
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            label="Email"
            id="email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
        {errors && <FormError>{error}</FormError>}
        <Button variant="contained" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
