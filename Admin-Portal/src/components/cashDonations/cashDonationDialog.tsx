import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Organization } from "~/types/organization";
import { CashDonationRow } from "~/types/cashDonationTypes";

interface CashDialogProps {
  organizations: void | Organization[] | undefined;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  editRow?: CashDonationRow;
}

const CashDonationsDialog: React.FC<CashDialogProps> = (props) => {
  const { organizations, selectedDate, onDateChange, editRow } = props;

  const [total, setTotal] = useState(editRow?.total || "");

  const [organization, setOrganization] = useState(editRow?.organization || "");

  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTotal(input);
  };

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    setOrganization(event.target.value as string);
  };

  return (
    <>
      <FormControl fullWidth margin="dense">
        <InputLabel id="Donor">Donor</InputLabel>
        <Select
          required={true}
          labelId="organization-label"
          id="organization-select"
          value={organization}
          label="Donor"
          onChange={handleOrganizationChange}
          name="organization"
        >
          {organizations?.map((org) => (
            <MenuItem key={org.id} value={org.name}>
              {org.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
