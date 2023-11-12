/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { items, itemType } from "./Items";
import { set } from "react-hook-form";

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(items);
  const [currentItem, setCurrentItem] = useState<itemType | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newItemCount, setNewItemCount] = useState(0);
  const [usedItemCount, setUsedItemCount] = useState(0);
  const [selectedItemKey, setSelectedItemKey] = useState(null);

  const handleDetailOpen = (itemName) => {
    setSelectedItemKey(itemName);
    const currentItemValues = currentItem?.values[itemName];
    setNewItemCount(currentItemValues?.newCount || 0);
    setUsedItemCount(currentItemValues?.usedCount || 0);
    setDetailOpen(true);
  };

  const handleSaveDetails = () => {
    if (currentItem && selectedItemKey) {
      const updatedItems = { ...selectedItems };
      if (!updatedItems[currentItem.item][selectedItemKey]) {
        updatedItems[currentItem.item][selectedItemKey] = [0, 0];
      }
      // 0th item is usedItems, 1st item is newItems
      updatedItems[currentItem.item][selectedItemKey][0] = usedItemCount;
      updatedItems[currentItem.item][selectedItemKey][1] = newItemCount;

      setSelectedItems(updatedItems);
    }
    setNewItemCount(0);
    setUsedItemCount(0);
    setDetailOpen(false);
  };

  const handleClickOpen = ({ item, values }: any) => {
    console.log(item, values);
    setCurrentItem({ item, values });
    setOpen(true);
  };

  const handleClose = () => {
    setCurrentItem(null);
    setOpen(false);
  };

  function valuetext(value) {
    return `${value}`;
  }

  return (
    <div>
      <Grid container spacing={3}>
        {Object.entries(selectedItems).map(([category, values]) => (
          <Grid item key={category} xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              onClick={() => {
                handleClickOpen({ item: category, values: values });
              }}
            >
              {category}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <List>
            {currentItem?.values &&
              Object.entries(currentItem.values).map(([key, value]) => (
                <ListItem key={key}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDetailOpen(key)}
                  >
                    {key}
                  </Button>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)}>
        <DialogTitle>Item Details</DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {" "}
            <Typography variant="h6">Used Item Count</Typography>
            <IconButton
              onClick={() => setUsedItemCount((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="body1">{usedItemCount}</Typography>
            <IconButton onClick={() => setUsedItemCount((prev) => prev + 1)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {" "}
            <Typography variant="h6">New Item Count</Typography>
            <IconButton
              onClick={() => setNewItemCount((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="body1">{newItemCount}</Typography>
            <IconButton onClick={() => setNewItemCount((prev) => prev + 1)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Button onClick={handleSaveDetails} color="primary">
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
