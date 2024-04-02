import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SuccessMessageProps {
  message?: string | null;
  success: boolean | null;
  setSuccess: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({message,
  success,
  setSuccess,
}) => {
  const handleClose = () => {
    setSuccess(false);
  };

  const displayMessage = message == null ? "Success!" : message 
  return (
    <Snackbar
      open={success || false}
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
        {displayMessage}
      </Alert>
    </Snackbar>
  );
};
