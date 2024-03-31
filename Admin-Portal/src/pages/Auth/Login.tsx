import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../lib/contexts";
import { Box, TextField, Button, Snackbar, Alert } from "@mui/material";
import { DEFAULT_PAGE } from "../../lib/constants";
import { getAdminByEmail } from "../../lib/services";
import { ErrorMessage } from "../../components/ErrorMessage";

interface FormValues {
  email: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

interface SuccessMessageProps {
  success: string | null;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  success,
  setSuccess,
}) => {
  const handleClose = () => {
    setSuccess(null);
  };
  return (
    <Snackbar
      open={success != null}
      autoHideDuration={3000}
      onClose={handleClose}
      style={{
        position: "fixed",
        left: "50%",
        top: "30%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {success}
      </Alert>
    </Snackbar>
  );
};

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

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        await sendLoginEmail(values.email);
        setSuccess("Login email sent. Please check your inbox to login.");
        setTimeout(() => {
          navigate(DEFAULT_PAGE);
        }, 5000);
      } else {
        setError("Email is not found in admin database");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <ErrorMessage error={error} setError={setError} />;
  }
  if (success != null) {
    return <SuccessMessage success={success} setSuccess={setSuccess} />;
  }

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
        <Button variant="contained" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Login"}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
