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
import { getModalItems } from "../../lib/services";
import { ResponseInventoryItem } from "~/types/inventory";
import deleteIcon from "../../assets/delete-icon.png";
import { focusManager } from "@tanstack/react-query";

interface ItemFieldProps {
  onDelete: () => void;
  isSubmitted: boolean;
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
  isSubmitted,
}) => {
  const [itemList, setItemList] = useState<ResponseInventoryItem[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<ResponseInventoryItem | null>(null);
  const [quantityUsed, setQuantityUsed] = useState<number>(0);
  const [quantityNew, setQuantityNew] = useState<number>(0);
  const [valueUsed, setValueUsed] = useState<number>(0);
  const [valueNew, setValueNew] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [itemType, setItemType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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

  const handleItemTypeChange = (event: SelectChangeEvent) => {
    const selectedItemType = event.target.value;
    setItemType(selectedItemType);
  };

  function formatDollar(amount: number): string {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  useEffect(() => {
    if (isSubmitted && !selectedItem) {
      setError("Please select a donation.");
    } else {
      setError(null);
    }
  }, [isSubmitted, selectedItem]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      borderRadius={"10px"}
      padding={"7px"}
      marginBottom={1}
      sx={{ backgroundColor: "lightgray" }}
    >
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Item</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="Item"
          value={selectedItem ? selectedItem.name : ""}
          onChange={handleItemChange}
          error={!!error}
          sx={{ width: "150px" }}
        >
          {itemList.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Item</InputLabel>
          <Select
            label="ItemType"
            onChange={handleItemTypeChange}
            value={itemType}
          >
            <MenuItem value={"Used"}>Used</MenuItem>
            <MenuItem value={"New"}>New</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="standard"
          id="outlined-number"
          label="Value"
          type="string"
          disabled
          value={
            itemType === "New"
              ? formatDollar(valueNew)
              : itemType === "Used"
              ? formatDollar(valueUsed)
              : ""
          }
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: "100px" }}
        />
        <TextField
          error={isSubmitted && totalValue === 0}
          variant="standard"
          label="Quantity"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ width: "100px" }}
          onChange={
            itemType === "New"
              ? handleNewQuantityChange
              : itemType === "Used"
              ? handleUsedQuantityChange
              : undefined
          }
        />
      </>
      <Box sx={{ minWidth: "150px", flexWrap: "wrap" }}>
        <Typography>Total: ${totalValue}</Typography>
      </Box>
      <IconButton onClick={onDelete} style={{ marginRight: "200" }}>
        <img
          className="delete-item-icon"
          src={deleteIcon}
          alt="Delete Item Icon"
        />
      </IconButton>
    </Box>
  );
};

export default ItemField;
