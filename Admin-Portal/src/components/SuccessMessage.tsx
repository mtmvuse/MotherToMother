import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SuccessMessageProps {
  success: boolean | null;
  setSuccess: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  success,
  setSuccess,
}) => {
  const handleClose = () => {
    setSuccess(false);
  };
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
        Success!
      </Alert>
    </Snackbar>
  );
};
