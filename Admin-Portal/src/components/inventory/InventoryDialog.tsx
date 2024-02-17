import { TextField, Box, MenuItem } from "@mui/material";
import * as React from "react";
import { inventoryRow } from "~/types/inventory";

interface InventoryDialogProps {
  categories: void | string[] | undefined;
  editRow?: inventoryRow;
}

const AddInventoryDialog: React.FC<InventoryDialogProps> = ({
  categories,
  editRow,
}) => {
  console.log(editRow);
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
        <TextField
          autoFocus
          required
          margin="dense"
          id="category"
          select
          name="category"
          label="Category"
          defaultValue={editRow == undefined ? "" : editRow?.category}
          type="text"
          variant="standard"
        >
          {categories?.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
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
