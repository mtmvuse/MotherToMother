import * as React from "react";
import { TextField, FormControl, Autocomplete } from "@mui/material";
import { ORGANIZATION_TYPE } from "../../lib/constants";

const OrganizationDialog = () => {
  const [type, setType] = React.useState("");
  const handleTypeChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      console.log("ORG TYPE:", newValue);
      setType(newValue);
    } else {
      console.log("EMPTY ORG TYPE");
    }
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
        <Autocomplete
          id="org-type-autocomplete"
          onChange={(event, newValue) => handleTypeChange(event, newValue)}
          options={Object.values(ORGANIZATION_TYPE)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Organization Type"
              margin="dense"
              name="type"
            />
          )}
          fullWidth
        />
      </FormControl>
    </>
  );
};

export default OrganizationDialog;
