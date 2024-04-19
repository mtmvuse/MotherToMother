import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../lib/contexts";
import { Box, TextField, Button } from "@mui/material";
import { DEFAULT_PAGE } from "../../lib/constants";
import { getAdminByEmail } from "../../lib/services";
import { ErrorMessage } from "../../components/ErrorMessage";
import { SuccessMessage } from "../../components/SuccessMessage";

interface FormValues {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Login: React.FC = () => {
  const { currentUser, authError, sendLoginEmail } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentUser) {
      navigate(DEFAULT_PAGE);
    }
  }, [currentUser, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await getAdminByEmail(values.email);
      const adminStatus = await response.status;
      if (adminStatus == 200) {
        const res = await sendLoginEmail(values.email);
        if (!res) {
          setError(
            authError ?? "Error sending login email. Please try again later. "
          );
          return;
        }
        setSuccess(true);
        setTimeout(() => {
          navigate(DEFAULT_PAGE);
        }, 5000);
      } else if (adminStatus == 404) {
        setError("Email is not found in admin database");
      } else {
        setError("Internal error. Please try again later.");
      }
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
      {error && <ErrorMessage error={error} setError={setError} />}
      {success && (
        <SuccessMessage
          message={"Login email sent. Please check your inbox to login."}
          success={success}
          setSuccess={setSuccess}
        />
      )}
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
        <Button variant="contained" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
