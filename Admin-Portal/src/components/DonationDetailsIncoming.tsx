import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ItemsTable from "./ItemsTable";
import { itemTypes } from "~/Types/DonationTypes";

interface ModalContentProps {
  selectedDonation: any;
}

const createItemData = (
  id: number,
  item: string,
  status: string,
  value: number,
  quantity: number,
): itemTypes => {
  return { id, item, status, value, quantity };
};

const initialRows: itemTypes[] = [
  createItemData(1, "Clothes", "Used", 4, 11),
  createItemData(2, "Cribs", "Used", 12, 110),
];

const DonationDetailsIncoming: React.FC<ModalContentProps> = ({
  selectedDonation,
}) => {
  const [itemRows, setItemRows] = useState<itemTypes[]>(initialRows);
  const [editable, setEditable] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [idItemCounter, setIdItemCounter] = useState(2);

  const dateString = selectedDonation?.date
    ? new Date(selectedDonation.date).toLocaleDateString()
    : "";

  const handleEditButtonClick = () => {
    setEditable(!editable);
  };

  const handleCancelButtonClick = () => {
    setEditable(false);
    setItemRows(initialRows);
  };

  const handleSaveButtonClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    setEditable(false);
    setOpenConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setOpenConfirmDialog(false);
  };

  const handleAddItemButtonClick = () => {
    const hasEmptyFields = itemRows.some((row) =>
      Object.values(row).some((value) => value === "" || value === 0),
    );

    if (hasEmptyFields) {
      console.log(
        "Please fill all fields in the current rows before adding a new row.",
      );
      return;
    }

    setItemRows((prevRows) => [
      ...prevRows,
      {
        id: idItemCounter + 1,
        item: "",
        status: "",
        value: 0,
        quantity: 0,
      },
    ]);
    setIdItemCounter(idItemCounter + 1); // Update the id counter after adding a new row
  };

  return (
    <Box p={2} sx={{ overflowY: "auto" }}>
      <h2>Donation Detail</h2>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <p>{dateString}</p>
        <p>{selectedDonation?.organization}</p>
      </Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          p: 1,
        }}
      >
        {!editable && (
          <Button variant="contained" onClick={handleEditButtonClick}>
            Edit
          </Button>
        )}
        {editable && (
          <>
            <Button onClick={handleSaveButtonClick}>Save</Button>
            <Button onClick={handleCancelButtonClick}>Cancel</Button>
            <Button onClick={handleAddItemButtonClick}>Add Item</Button>
          </>
        )}
      </Box>
      <div
        style={{
          border: "4px solid black",
          borderRadius: "5px",
        }}
      >
        <ItemsTable editable={editable} rows={itemRows} setRows={setItemRows} />
      </div>
      <Dialog open={openConfirmDialog} onClose={handleCancelConfirm}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Cancel</Button>
          <Button onClick={handleConfirmSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationDetailsIncoming;
