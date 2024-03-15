import React, { useState, useEffect } from "react";
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
import DemographicTable from "./DemographicTable";
import {
  DemographicDetails,
  ItemDetails,
  ResponseDonation,
} from "~/types/DonationTypes";
import {
  getDonationDemographics,
  getDonationDetails,
} from "../../lib/services";

interface ModalContentProps {
  selectedDonation: ResponseDonation;
}

const DonationDetailsIncoming: React.FC<ModalContentProps> = ({
  selectedDonation,
}) => {
  const [itemRows, setItemRows] = useState<ItemDetails[]>([]);
  const [demographicRows, setDemographicRows] = useState<DemographicDetails[]>(
    []
  );
  const [editable, setEditable] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [idItemCounter, setIdItemCounter] = useState(20);
  const [idDemoCounter, setIdDemoCounter] = useState(30);

  useEffect(() => {
    const fetchItemRows = async () => {
      try {
        const response = await getDonationDetails(selectedDonation.id);
        if (response.ok) {
          const data = await response.json();
          const mappedData: ItemDetails[] = data.map(
            (itemData: ItemDetails) => ({
              id: itemData.id,
              name: itemData.name,
              quantityNew: itemData.quantityNew,
              quantityUsed: itemData.quantityUsed,
              valueNew: itemData.valueNew,
              valueUsed: itemData.valueUsed,
            })
          );
          setItemRows(mappedData);
        } else {
          throw new Error("Failed to fetch item rows");
        }
      } catch (error) {
        console.error("Error fetching item rows:", error);
      }
    };

    fetchItemRows();
  }, [selectedDonation]);

  const dateString = selectedDonation?.date
    ? new Date(selectedDonation.date).toLocaleDateString()
    : "";

  const handleEditButtonClick = () => {
    setEditable(!editable);
  };

  const handleCancelButtonClick = () => {
    setEditable(false);
    setItemRows(itemRows);
    setDemographicRows(demographicRows);
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
      Object.values(row).some((value) => value === "" || value === 0)
    );

    if (hasEmptyFields) {
      console.log(
        "Please fill all fields in the current rows before adding a new row."
      );
      return;
    }

    setItemRows((prevRows) => [
      ...prevRows,
      {
        id: idItemCounter + 1,
        name: "",
        valueNew: 0,
        valueUsed: 0,
        quantityNew: 0,
        quantityUsed: 0,
      },
    ]);
    setIdItemCounter(idItemCounter + 1);
  };

  const handleAddDemoButtonClick = () => {
    const hasEmptyFields = demographicRows.some((row) =>
      Object.values(row).some((value) => !value)
    );

    if (hasEmptyFields) {
      console.log(
        "Please fill all fields in the current rows before adding a new row."
      );
      return;
    }

    setDemographicRows((prevRows) => [
      ...prevRows,
      {
        id: idDemoCounter + 1,
        kidGroup: "",
        quantity: 0,
      },
    ]);
    setIdDemoCounter(idDemoCounter + 1);
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
            <Button onClick={handleAddDemoButtonClick}>Add Demographic</Button>
          </>
        )}
      </Box>
      <div
        style={{
          border: "4px solid black",
          borderRadius: "5px",
        }}
      >
        <ItemsTable rows={itemRows} setRows={setItemRows} editable={editable} />
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
