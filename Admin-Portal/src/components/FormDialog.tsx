import * as React from "react";
import {
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";

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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
