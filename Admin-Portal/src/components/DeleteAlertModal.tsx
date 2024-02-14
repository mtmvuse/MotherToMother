import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

interface DeleteAlertModalProps {
  open: boolean;
  scenario: string;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteAlertModal: React.FC<DeleteAlertModalProps> = (props) => {
  const { open, scenario, handleClose, handleDelete } = props;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this {scenario}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAlertModal;
