/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type SpecificItemsProps = {
  open: boolean;
  onClose: () => void;
  category: string;
  subCategory: string;
  subCategoryValues: [number, number];
};

const SpecificItems = ({
  open,
  onClose,
  category,
  subCategory,
  subCategoryValues,
}: SpecificItemsProps) => {
  const [newItemCount, setNewItemCount] = useState(subCategoryValues[0]);
  const [usedItemCount, setUsedItemCount] = useState(subCategoryValues[1]);

  console.log(open, category, subCategory, subCategoryValues);

  const handleSaveDetails = () => {
    // TODO: SAVE THE DETAILS IN THE LOWER COMPONENTS
    // Prepare the updated data
    const updatedData = { newItemCount, usedItemCount };
    // Invoke the callback
    // props.onUpdate(updatedData);
    handleClose();
    handleClose();
  };
  const handleCancelDetails = () => {
    // TODO: SAVE THE DETAILS IN THE LOWER COMPONENTS
    // Prepare the updated data
    const updatedData = { newItemCount, usedItemCount };
    // Invoke the callback
    // props.onUpdate(updatedData);
    setNewItemCount(0);
    setUsedItemCount(0);
    handleClose();
    handleClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
            {category} - {subCategory}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" sx={{ pb: "16px" }}>
            Enter the number of new or used {category} you will donate.
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {" "}
            <Typography variant="h6">New</Typography>
            <IconButton
              onClick={() => setNewItemCount((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6">{newItemCount}</Typography>
            <IconButton onClick={() => setNewItemCount((prev) => prev + 1)}>
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
            <Typography variant="h6">Used</Typography>
            <IconButton
              onClick={() => setUsedItemCount((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6">{usedItemCount}</Typography>
            <IconButton onClick={() => setUsedItemCount((prev) => prev + 1)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
          >
            <Button
              variant="outlined"
              onClick={handleCancelDetails}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleSaveDetails}
              color="primary"
            >
              Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecificItems;
