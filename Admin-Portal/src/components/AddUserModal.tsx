import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const AddUserModal: React.FC = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [typeOptions, setTypeOptions] = useState<string[]>([
    "Coperate",
    "Other",
  ]);
  const [organization, setOrganization] = useState<string[]>([
    "Amazon",
    "Target",
  ]);
  const handleSaveButtonClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    setOpenConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Box p={2} sx={{ overflowY: "auto" }}>
      <h2>Add User</h2>
      <div>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Orginization
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Orginization"
          >
            <MenuItem value={"Target"}>Target</MenuItem>
            <MenuItem value={"Amazon"}>Amazon</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Type"
          >
            <MenuItem value={"Coperate"}>Coperate</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="standard"
          id="outlined-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <Button onClick={handleSaveButtonClick} variant="contained">
        Submit
      </Button>
      <Dialog open={openConfirmDialog} onClose={handleCancelConfirm}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancel</Button>
          <Button onClick={handleConfirmSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddUserModal;
