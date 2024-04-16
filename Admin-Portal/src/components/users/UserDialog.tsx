import * as React from "react";
import { Box, TextField, FormControl, Autocomplete } from "@mui/material";
import { USER_TYPE, USER_STATUS } from "../../lib/constants";
import type { Organization } from "~/types/organization";
import type { UserRow } from "~/types/user";

interface UserDialogProps {
  organizations: void | Organization[] | undefined;
  editRow?: UserRow;
}

const UserDialog: React.FC<UserDialogProps> = (props) => {
  const { organizations, editRow } = props;
  const [userType, setUserType] = React.useState(editRow?.type || "");
  const [organization, setOrganization] = React.useState(
    editRow?.organization || ""
  );
  const [status, setStatus] = React.useState(editRow?.status || "");

  const handleUserTypeChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setUserType(newValue);
      setOrganization("");
    }
  };

  const handleOrganizationChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setOrganization(newValue);
    }
  };

  const handleStatusChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setStatus(newValue);
    }
  };

  const [firstName, lastName] = editRow?.name.split(" ") || [];
  const [address, city, state, zip] = editRow?.address.split(", ") || [];
  return (
    <>
      <Box>
        <TextField
          autoFocus
          required
          margin="dense"
          id="first_name"
          name="firstName"
          label="First Name"
          type="text"
          variant="standard"
          defaultValue={firstName}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="last_name"
          name="lastName"
          label="Last Name"
          type="text"
          variant="standard"
          defaultValue={lastName}
        />
      </Box>
      <TextField
        autoFocus
        required
        margin="dense"
        id="email"
        name="email"
        label="Email Address"
        type="email"
        fullWidth
        variant="standard"
        defaultValue={editRow?.email}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="phone"
        name="phone"
        label="Phone Number"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={editRow?.phone}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="address"
        name="address"
        label="Address"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={address}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="city"
        name="city"
        label="City"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={city}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="state"
        name="state"
        label="State"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={state}
      />
      <TextField
        autoFocus
        required
        margin="dense"
        id="zip"
        name="zip"
        label="Zip"
        type="text"
        fullWidth
        variant="standard"
        defaultValue={zip}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <FormControl>
          <Autocomplete
            id="user-type-autocomplete"
            onChange={(event, newValue) =>
              handleUserTypeChange(event, newValue)
            }
            options={Object.values(USER_TYPE)}
            defaultValue={editRow?.type || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="User Type"
                margin="dense"
                name="userType"
              />
            )}
            fullWidth
          />
        </FormControl>
        <FormControl>
          <Autocomplete
            id="status-autocomplete"
            onChange={(event, newValue) => handleStatusChange(event, newValue)}
            options={Object.values(USER_STATUS)}
            defaultValue={editRow?.status || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Status"
                margin="dense"
                name="status"
              />
            )}
            fullWidth
          />
        </FormControl>
      </div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={
          organizations
            ?.filter((org) => org.type === userType?.split(" ")[0])
            ?.map((org) => org.name) || []
        }
        defaultValue={editRow?.organization || ""}
        value={organization}
        onChange={handleOrganizationChange}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="dense"
            label="Organization"
            name="organization"
          />
        )}
      />
    </>
  );
};

export default UserDialog;
