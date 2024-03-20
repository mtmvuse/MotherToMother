import * as React from "react";
import { TextField } from "@mui/material";
import type { AdminRow } from "~/types/admin";

interface AdminDialogProps {
  editRow?: AdminRow;
}

const AdminDialog: React.FC<AdminDialogProps> = ({ editRow }) => {
  return (
    <>
      <TextField
        autoFocus
        required
        margin="dense"
        id="name"
        name="name"
        label="Name"
        type="text"
        variant="standard"
        fullWidth
        defaultValue={editRow?.name}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="email"
        name="email"
        label="Email"
        type="text"
        variant="standard"
        fullWidth
        defaultValue={editRow?.email}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="role"
        name="role"
        label="Role"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={editRow?.role}
      />
    </>
  );
};

export default AdminDialog;
