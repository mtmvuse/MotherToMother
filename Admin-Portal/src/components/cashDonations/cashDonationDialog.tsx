import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Organization } from "~/types/organization";

interface CashDialogProps {
  organizations: void | Organization[] | undefined;
}

const CashDonationsDialog: React.FC<CashDialogProps> = (props) => {
  const { organizations } = props;
  const [total, setTotal] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [organization, setOrganization] = React.useState();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = parseFloat(event.target.value);
    setTotal(input);
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
          value={organization}
        >
          {organizations?.map((org) => (
            <MenuItem key={org.id} value={org.name}>
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
