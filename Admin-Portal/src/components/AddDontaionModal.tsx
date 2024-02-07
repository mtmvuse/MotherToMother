import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ItemField from "../Components/ItemField";
import { Typography } from "@mui/material";

const AddDonationsModal: React.FC<{}> = () => {
  const [donor, setDonor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setDonor(event.target.value);
    setShowCalendar(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowAddButton(!!date);
  };

  const addItemField = () => {
    setItems([...items, {}]);
  };

  const removeItemField = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  useEffect(() => {
    let newTotalQuantity = 0;
    let newTotalCost = 0;

    items.forEach((item) => {
      if (item.quantity && item.price) {
        newTotalQuantity += item.quantity;
        newTotalCost += item.quantity * item.price;
      }
    });

    setTotalQuantity(newTotalQuantity);
    setTotalCost(newTotalCost);
  }, [items]);

  const handleQuantityChange = (
    index: number,
    quantity: number,
    price: number,
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { quantity, price };
    setItems(updatedItems);
  };

  return (
    <Box p={2} sx={{ overflowY: "auto" }}>
      <Typography variant="h5" textAlign="center">
        Add Donation
      </Typography>
      <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
        <InputLabel id="donor-select-label">Donor</InputLabel>
        <Select
          labelId="donor-select-label"
          id="donor-select"
          value={donor}
          onChange={handleChange}
          label="Donor"
        >
          <MenuItem value={"Target"}>Target</MenuItem>
          <MenuItem value={"Vanderbilt"}>Vanderbilt</MenuItem>
          <MenuItem value={"DMR"}>DMR</MenuItem>
        </Select>
      </FormControl>
      {showCalendar && (

  <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker onChange={handleDateChange} value={selectedDate} label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider>

      )}
      {showAddButton && (
        <Button
          variant="contained"
          onClick={addItemField}
          sx={{ mt: 2, mb: 1 }}
        >
          Add Item
        </Button>
      )}
      {items.map((item, index) => (
        <ItemField
          key={index}
          onDelete={() => removeItemField(index)}
          onQuantityChange={(quantity, price) =>
            handleQuantityChange(index, quantity, price)
          }
        />
      ))}
      {items.length > 0 && (
        <div>
          <Typography>Total Items: {totalQuantity}</Typography>
          <Typography>Total Cost: ${totalCost}</Typography>

          <Button variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </div>
      )}
    </Box>
  );
};

export default AddDonationsModal;
