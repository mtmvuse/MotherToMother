import * as React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { ORGANIZATION_TYPE } from "../../lib/constants";

const OrganizationDialog = () => {
  const [type, setType] = React.useState("");
  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

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
      />
      <FormControl fullWidth margin="dense">
        <InputLabel id="org-type">Type</InputLabel>
        <Select
          labelId="org-type-label"
          id="org-type-select"
          value={type}
          label="Type"
          onChange={handleTypeChange}
          name="type"
        >
          {Object.values(ORGANIZATION_TYPE).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default OrganizationDialog;
