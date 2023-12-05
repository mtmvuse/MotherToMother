import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm } from "../../contexts/FormContext";
import type { DonationDetailType } from "../../types/FormTypes";

import "./SpecificItemsDialog.css";

type SpecificItemsProps = {
  open: boolean;
  onClose: () => void;
  category: string;
  item: string;
  itemValues: [number, number];
  setItemValues: (values: [number, number]) => void;
};

export const SpecificItemsDialog = ({
  open,
  onClose,
  category,
  item,
  itemValues,
  setItemValues,
}: SpecificItemsProps) => {
  const [newQuantity, setNewQuantity] = useState(itemValues[0]);
  const [usedQuantity, setUsedQuantity] = useState(itemValues[1]);
  const { setDonationDetails } = useForm();

  useEffect(() => {
    if (!open) {
      // Reset the state when the dialog is closed
      setNewQuantity(itemValues[0]);
      setUsedQuantity(itemValues[1]);
    }
  }, [open, itemValues]);

  const handleSaveDetails = () => {
    setItemValues([newQuantity, usedQuantity]);
    setDonationDetails((prev) => {
      const updatedDonationDetails = [...prev];
      const existingItemIndex = updatedDonationDetails.findIndex(
        (detail) => detail.item === item,
      );

      if (existingItemIndex !== -1) {
        // Item already exists, update it
        updatedDonationDetails[existingItemIndex] = {
          item,
          category,
          newQuantity,
          usedQuantity,
        } as DonationDetailType;
      } else {
        // Item doesn't exist, add it
        updatedDonationDetails.push({
          item,
          category,
          newQuantity,
          usedQuantity,
        } as DonationDetailType);
      }

      console.log(updatedDonationDetails);
      return updatedDonationDetails;
    });
    handleClose();
  };
  const handleCancelDetails = () => {
    setNewQuantity(itemValues[0]);
    setUsedQuantity(itemValues[1]);
    handleClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div id="SpecificItems-Dialog">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography align="center" sx={{ fontWeight: "bold" }}>
            {category} - {item}
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
            <Typography>New</Typography>
            <IconButton
              onClick={() => setNewQuantity((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography>{newQuantity}</Typography>
            <IconButton onClick={() => setNewQuantity((prev) => prev + 1)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Typography>Used</Typography>
            <IconButton
              onClick={() => setUsedQuantity((prev) => Math.max(prev - 1, 0))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography>{usedQuantity}</Typography>
            <IconButton onClick={() => setUsedQuantity((prev) => prev + 1)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Grid
            container
            spacing={1}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleCancelDetails}
                color="primary"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleSaveDetails}
                color="primary"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
