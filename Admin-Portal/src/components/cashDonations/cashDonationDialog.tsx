import React, { useState } from "react";
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

interface CashDialogProps {
  organizations: void | Organization[] | undefined;
  selectedDate: Date | null;
  onOrgIdChange: (orgId: number | null) => void;
  onDateChange: (date: Date | null) => void;
}

const CashDonationsDialog: React.FC<CashDialogProps> = (props) => {
  const { organizations, selectedDate, onDateChange, onOrgIdChange } = props;
  const [total, setTotal] = useState<number>();

  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = parseFloat(event.target.value);
    setTotal(input);
  };

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    const input = parseFloat(event.target.value);
    onOrgIdChange(input);
  };

  return (
    <>
      <FormControl fullWidth margin="dense">
        <InputLabel id="donor-type">Donor</InputLabel>
        <Select
          required={true}
          labelId="user-type-label"
          id="user-type-select"
          label="Donor"
          onChange={handleOrganizationChange}
        >
          {organizations?.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </Select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              label="Select a date"
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
      </FormControl>
    </>
  );
};

export default CashDonationsDialog;
