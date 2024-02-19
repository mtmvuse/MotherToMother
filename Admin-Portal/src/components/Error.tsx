import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ErrorProps {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Error: React.FC<ErrorProps> = ({ error, setError }) => {
  const handleClose = () => {
    setError(null);
  };

  return (
    <Snackbar
      open={error !== null}
      autoHideDuration={5000}
      onClose={handleClose}
      style={{
        position: "fixed",
        left: "50%",
        top: "30%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};
