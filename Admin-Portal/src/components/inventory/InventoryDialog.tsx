import { TextField, Box, FormControl, Autocomplete } from "@mui/material";
import React, { useState } from "react";
import { inventoryRow } from "~/types/inventory";

interface InventoryDialogProps {
  categories: string[];
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

  const changeCategory = (newValue: string | null) => {
    setCategory(newValue || "");
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
          defaultValue={editRow?.name || ""}
        />
        <FormControl fullWidth margin="dense">
          <Autocomplete
            id="category-autocomplete"
            options={categories}
            value={category}
            onChange={(
              event: React.ChangeEvent<{}>,
              newValue: string | null
            ) => {
              changeCategory(newValue);
            }}
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                required
                margin="dense"
                id="category"
                name="category"
                label="Inventory Category"
                variant="standard"
              />
            )}
          />
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
          defaultValue={editRow?.quantityNew || ""}
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
          defaultValue={editRow?.valueNew || ""}
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
          defaultValue={editRow?.quantityUsed || ""}
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
          defaultValue={editRow?.valueUsed || ""}
        />
      </div>
    </Box>
  );
};

export default AddInventoryDialog;
