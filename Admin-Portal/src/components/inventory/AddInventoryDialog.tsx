import { TextField, Box, MenuItem } from "@mui/material";
import * as React from "react";

interface AddInventoryDialogProps {
  categories: void | string[] | undefined;
}

const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({
  categories,
}) => {
  console.log(categories);
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
        />
        <TextField
          autoFocus
          required
          margin="dense"
          id="category"
          select
          name="category"
          label="Category"
          defaultValue={categories == undefined ? "Baby" : categories[0]}
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
        />
      </div>
    </Box>
  );
};

export default AddInventoryDialog;
