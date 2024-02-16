import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { CASHDONATION_TYPE } from "../../lib/constants";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const CashDonationsDialog: React.FC = () => {
  const [total, setTotal] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
        >
          {Object.values(CASHDONATION_TYPE).map((donor) => (
            <MenuItem key={donor} value={donor}>
              {donor}
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
