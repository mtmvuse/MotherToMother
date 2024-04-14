import * as React from "react";
import {
  Typography,
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
interface FormDialogProps {
  children: React.ReactNode;
  title: string;
  handleClose: () => void;
  open: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formSchema?: any;
}

const FormDialog: React.FC<FormDialogProps> = (props) => {
  const { children, title, handleClose, open, handleSubmit } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <IconButton
        onClick={handleClose}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>
        <Typography
          fontFamily="Raleway, sans-serif"
          fontSize={14}
          color="navy"
          mb={1}
          mt={2}
          style={{ letterSpacing: "2px" }}
          textAlign="left"
        >
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#F3F3F3",
          borderRadius: "10px",
          padding: "25px",
          m: "10px",
        }}
      >
        {children}
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          style={{
            display: "flex",
            width: "fit-content",
            backgroundColor: "#A4A4A4",
          }}
        >
          <Typography
            fontFamily="Raleway, sans-serif"
            fontSize={15}
            color="white"
          >
            Submit
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
