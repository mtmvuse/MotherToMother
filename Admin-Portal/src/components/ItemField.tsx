import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { Typography, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ItemFieldProps {
  onDelete: () => void;
  onQuantityChange: (quantity: number, price: number) => void;
}

const ItemField: React.FC<ItemFieldProps> = ({
  onDelete,
  onQuantityChange,
}) => {
  const [price, setPrice] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    onQuantityChange(quantity, price);
  }, [quantity, price, onQuantityChange]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(event.target.value);
    setQuantity(newQuantity);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      border={1}
      borderRadius={"10px"}
      borderColor="black"
      padding={"10px"}
      marginBottom={1}
    >
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Item</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Item"
        >
          <MenuItem value={"Baby Bath"}>Baby Bath</MenuItem>
          <MenuItem value={"Clothes"}>Clothes</MenuItem>
          <MenuItem value={"Diapers"}>Diapers</MenuItem>
        </Select>
      </FormControl>
      <Typography>${price}</Typography>
      <TextField
        variant="standard"
        id="outlined-number"
        label="Number"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleQuantityChange}
      />
      <Typography>${quantity * price}</Typography>
      <IconButton aria-label="delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default ItemField;
