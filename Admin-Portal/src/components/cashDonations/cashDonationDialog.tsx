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
import { CashDonationRow } from "~/types/cashDonationTypes";

interface CashDialogProps {
  organizations: void | Organization[] | undefined;
  selectedDate: Date | null;
  onOrgIdChange: (orgId: number | null) => void;
  onDateChange: (date: Date | null) => void;
  editRow?: CashDonationRow;
}

const CashDonationsDialog: React.FC<CashDialogProps> = (props) => {
  const { organizations, selectedDate, onDateChange, onOrgIdChange, editRow } =
    props;
  console.log("EditRow!!!", editRow);
  console.log("EditRow!!!", editRow?.organization);
  const [total, setTotal] = useState<number>(
    editRow == undefined ? 0 : Number(editRow?.total)
  );

  const [organization, setOrganization] = React.useState(
    editRow?.organization || ""
  );

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    onDateChange(date);
  };

  const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = parseFloat(event.target.value);
    setTotal(input);
  };

  const handleOrganizationChange = (event: SelectChangeEvent) => {
    const input = parseFloat(event.target.value);
    {
      console.log(event.target.value as string);
    }
    setOrganization(event.target.value as string);
    onOrgIdChange(input);
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
          defaultValue={editRow?.organization}
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
              defaultValue={editRow?.date}
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
