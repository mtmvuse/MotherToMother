import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Organization } from "~/types/organization";
import type { CDUser } from "~/types/cashDonationTypes";
import type { ResponseUser } from "~/types/user";
import { CashDonationRow } from "~/types/cashDonationTypes";
import { getUsersByOrganizationName } from "../../lib/services";
import { useAuth } from "../../lib/contexts";

interface CashDialogProps {
  organizations: void | Organization[] | undefined;
  editRow?: CashDonationRow;
}

const CashDonationsDialog: React.FC<CashDialogProps> = (props) => {
  const { organizations, editRow } = props;
  const [total, setTotal] = useState(editRow?.total || "");
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(editRow?.organization || null);
  const [userList, setUserList] = useState<CDUser[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<CDUser | null>(
    (editRow &&
      ({
        id: editRow?.userId,
        firstName: editRow?.firstName,
        lastName: editRow?.lastName,
      } as CDUser)) ||
      null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (selectedOrganization) {
      const fetchUsers = async () => {
        const token = await currentUser?.getIdToken();
        const response = await getUsersByOrganizationName(
          selectedOrganization,
          token
        );
        const users = await response?.json();
        const CDUsers = users.map((user: ResponseUser) => {
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        });
        setUserList(CDUsers);
      };
      fetchUsers();
    }
  }, [selectedOrganization]);

  const handleOrganizationChange = (_event: any, newValue: string | null) => {
    if (newValue) {
      setSelectedOrganization(newValue);
      setSelectedUser(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date && date > new Date()) {
      setErrorMessage("Cannot select date in the future.");
      setShowError(true);
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date);
  };

  const handleUserChange = (_event: any, newValue: CDUser | null) => {
    newValue ? setSelectedUser(newValue) : setSelectedUser(null);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTotal(input);
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={organizations?.map((org) => org.name) || []}
        defaultValue={selectedOrganization}
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

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={userList || []}
        getOptionLabel={(option) =>
          option ? `${option.firstName} ${option.lastName}` : ""
        }
        value={selectedUser}
        onChange={handleUserChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        defaultValue={selectedUser}
        renderInput={(params) => (
          <TextField {...params} margin="dense" label="User" name="user" />
        )}
      />

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={userList || []}
        getOptionLabel={(option) => (option ? option.id.toString() : "")}
        value={selectedUser}
        onChange={handleUserChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        defaultValue={selectedUser}
        renderInput={(params) => (
          <TextField {...params} margin="dense" label="User ID" name="userId" />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            label="Select a date"
            name="date"
          />
        </DemoContainer>
      </LocalizationProvider>

      {showError && (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )}

      <TextField
        autoFocus
        required={true}
        margin="dense"
        id="total"
        name="total"
        label="$"
        type="number"
        fullWidth
        variant="standard"
        value={total}
        onChange={handleTotalChange}
      />
    </>
  );
};

export default CashDonationsDialog;
