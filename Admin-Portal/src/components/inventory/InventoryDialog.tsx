import {
  TextField,
  Box,
  MenuItem,
  SelectChangeEvent,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { inventoryRow } from "~/types/inventory";

interface InventoryDialogProps {
  categories: void | string[] | undefined;
  editRow?: inventoryRow;
}

const AddInventoryDialog: React.FC<InventoryDialogProps> = ({
  categories,
  editRow,
}) => {
  const [category, setCategory] = useState<string>(
    editRow == undefined ? "" : editRow?.category.toString()
  );
  const [open, setOpen] = useState<boolean>(false);

  const changeCategrory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box>
      <div>
        <TextField
          autoFocus
          required
          margin="dense"
          id="item_name"
          name="itemName"
          label="Item Name"
          type="text"
          variant="standard"
          defaultValue={editRow?.itemName}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="inventory-category">Inventory Category</InputLabel>
          <Select
            autoFocus
            required
            margin="dense"
            id="category"
            name="category"
            labelId="inventory-category"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={category}
            label="Category"
            variant="standard"
            onChange={changeCategrory}
          >
            {categories?.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField
          autoFocus
          required
          margin="dense"
          id="new_stock"
          name="newStock"
          label="New Stock"
          type="number"
          variant="standard"
          defaultValue={editRow?.newStock}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="new_value"
          name="newValue"
          label="New Value"
          type="number"
          variant="standard"
          defaultValue={editRow?.newValue}
        />
      </div>
      <div>
        <TextField
          autoFocus
          required
          margin="dense"
          id="used_stock"
          name="usedStock"
          label="Used Stock"
          type="number"
          variant="standard"
          defaultValue={editRow?.usedStock}
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="used_value"
          name="usedValue"
          label="Used Value"
          type="number"
          variant="standard"
          defaultValue={editRow?.usedValue}
        />
      </div>
    </Box>
  );
};

export default AddInventoryDialog;
