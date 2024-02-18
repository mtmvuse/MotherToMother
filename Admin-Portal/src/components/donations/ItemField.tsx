import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import {
  Typography,
  TextField,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getModalItems } from "../../lib/services";
import { ResponseInventoryItem } from "~/types/inventory";

interface ItemFieldProps {
  onDelete: () => void;
  onQuantityChange: (
    quantityNew: number,
    quantityUsed: number,
    totalValue: number
  ) => void;
  onItemChange: (itemId: number) => void;
}

const ItemField: React.FC<ItemFieldProps> = ({
  onDelete,
  onQuantityChange,
  onItemChange,
}) => {
  const [itemList, setItemList] = useState<ResponseInventoryItem[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<ResponseInventoryItem | null>(null);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [quantityNew, setQuantityNew] = useState<number>(0);
  const [valueUsed, setValueUsed] = useState<number>(0);
  const [valueNew, setValueNew] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);

  useEffect(() => {
    setOptions();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setTotalValue(quantityUsed * valueUsed + quantityNew * valueNew);
      onQuantityChange(quantityNew, quantityUsed, totalValue);
    }
  }, [quantityUsed, quantityNew, selectedItem, totalValue, onQuantityChange]);

  const setOptions = async () => {
    try {
      const response = await getModalItems();
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items");
      }
      const itemList: ResponseInventoryItem[] = await response.json();
      setItemList(itemList);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleUsedQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tmpUsedQuantity = Number(event.target.value);
    setQuantityUsed(tmpUsedQuantity);
  };

  const handleNewQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tmpNewQuantity = Number(event.target.value);
    setQuantityNew(tmpNewQuantity);
  };

  const handleItemChange = (event: SelectChangeEvent) => {
    const selectedItemName = event.target.value as string;
    const foundItem = itemList.find((item) => item.name === selectedItemName);
    if (foundItem) {
      setSelectedItem(foundItem);
      setValueNew(foundItem.valueNew);
      setValueUsed(foundItem.valueUsed);
      onItemChange(foundItem.id);
    }
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
          value={selectedItem ? selectedItem.name : ""}
          onChange={handleItemChange}
        >
          {itemList.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <>
        <Typography>Value Used: ${valueUsed}</Typography>
        <TextField
          variant="standard"
          id="outlined-number"
          label="Quantity Used"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleUsedQuantityChange}
        />
        <Typography>Value New: ${valueNew}</Typography>
        <TextField
          variant="standard"
          id="outlined-number"
          label="Quantity New"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleNewQuantityChange}
        />
      </>
      <Typography>Total Value: ${totalValue}</Typography>
      <IconButton aria-label="delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default ItemField;
