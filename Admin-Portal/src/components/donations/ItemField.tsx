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
  const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
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

  const handleItemChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: ResponseInventoryItem | null
  ) => {
    if (newValue !== null) {
      setSelectedItem(newValue);
      setValueNew(newValue.valueNew);
      setValueUsed(newValue.valueUsed);
      onItemChange(newValue.id);
    }
  };

  const handleItemTypeChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue !== null) {
      setItemType(newValue);
    }
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
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      borderRadius={"10px"}
      padding={"7px"}
      marginBottom={1}
      sx={{ backgroundColor: "lightgray" }}
    >
      <FormControl sx={{ minWidth: 120 }}>
        <Autocomplete
          id="item-autocomplete"
          value={selectedItem}
          onChange={(event, newValue) => handleItemChange(event, newValue)}
          options={itemList}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Item" />}
          fullWidth
        />
      </FormControl>
      <>
        <FormControl sx={{ minWidth: 120 }}>
          <Autocomplete
            id="item-type-autocomplete"
            value={itemType}
            onChange={(event, newValue) =>
              handleItemTypeChange(event, newValue)
            }
            sx={{ width: "150px" }}
            options={["Used", "New"]}
            renderInput={(params) => <TextField {...params} label="Type" />}
            fullWidth
          />
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
          value={itemType === "New" ? quantityNew : quantityUsed}
          disabled={!itemType}
          InputLabelProps={{
            shrink: true,
          }}
          onKeyDown={preventMinus}
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
        <Typography
          fontFamily={"raleway, sans-sherif"}
          fontWeight={"bold"}
          sx={{
            minWidth: "150px",
            maxWidth: "150px",
            overflowWrap: "break-word",
          }}
        >
          Total: ${totalValue}
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
