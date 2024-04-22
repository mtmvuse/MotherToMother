import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { Typography, TextField, IconButton, Autocomplete } from "@mui/material";
import { getModalItems } from "../../lib/services";
import { ResponseInventoryItem } from "~/types/inventory";
import deleteIcon from "../../assets/delete-icon.png";

interface ItemFieldProps {
  onDelete: () => void;
  isSubmitted: boolean;
  onQuantityChange: (
    type: string,
    quantity: number,
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
  const [quantity, setQuantity] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [itemType, setItemType] = useState<string | null>(null);

  useEffect(() => {
    setOptions();
  }, []);

  useEffect(() => {
    if (selectedItem && itemType && quantity >= 0) {
      setTotalValue(quantity * value);
      onQuantityChange(itemType, quantity, totalValue);
    }
  }, [quantity, selectedItem, totalValue, onQuantityChange]);

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
  const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpQuantity = Number(event.target.value);
    setQuantity(tmpQuantity);
  };

  const handleItemChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: ResponseInventoryItem | null
  ) => {
    if (newValue !== null) {
      setSelectedItem(newValue);
      onItemChange(newValue.id);
    }
  };

  const handleItemTypeChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (!selectedItem) {
      return;
    }
    if (newValue !== null) {
      setItemType(newValue);
      if (newValue === "New") {
        setValue(selectedItem.valueNew);
      } else if (newValue === "Used") {
        setValue(selectedItem.valueUsed);
      }
    }
  };

  function formatDollar(amount: number): string {
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

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
      <FormControl sx={{ minWidth: 200 }}>
        <Autocomplete
          id="item-autocomplete"
          value={selectedItem}
          onChange={(event, newValue) => handleItemChange(event, newValue)}
          options={itemList}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Item" variant="standard" />
          )}
          sx={{ width: "200px", marginRight: "80px" }}
          fullWidth
        />
      </FormControl>
      <FormControl>
        <Autocomplete
          id="item-type-autocomplete"
          value={itemType}
          onChange={(event, newValue) => handleItemTypeChange(event, newValue)}
          sx={{ width: "100px", marginRight: "40px" }}
          options={["Used", "New"]}
          renderInput={(params) => (
            <TextField {...params} label="Type" variant="standard" />
          )}
          fullWidth
        />
      </FormControl>
      <TextField
        variant="standard"
        id="outlined-number"
        label="Value"
        type="string"
        disabled
        value={formatDollar(value)}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ width: "80px", marginRight: "10px" }}
      />
      <TextField
        error={isSubmitted && totalValue === 0}
        variant="standard"
        label="Quantity"
        type="Number"
        value={quantity}
        disabled={!itemType}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{ inputProps: { min: 0, max: 10 } }}
        onKeyDown={preventMinus}
        sx={{ width: "100px", marginRight: "20px" }}
        onChange={handleQuantityChange}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          fontFamily={"raleway, sans-serif"}
          fontWeight={"bold"}
          style={{ minWidth: "60px" }}
        >
          Total: $
        </Typography>
        <Typography
          fontFamily={"raleway, sans-serif"}
          fontWeight={"bold"}
          style={{
            minWidth: "70px",
            maxWidth: "70px",
            overflowWrap: "break-word",
          }}
        >
          {totalValue}
        </Typography>
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
