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
import DemographicTable from "./DemographicTable";
import { demographicTypes, itemTypes } from "~/Types/DonationTypes";

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

const createDemographicData = (
  id: number,
  kidGroup: string,
  quantity: number,
): demographicTypes => {
  return { id, kidGroup, quantity };
};

const initialDemographicRows: demographicTypes[] = [
  createDemographicData(1, "White children", 10),
  createDemographicData(2, "Black children", 20),
  createDemographicData(3, "Asian children", 10),
];

const initialItemRows: itemTypes[] = [
  createItemData(1, "Clothes", "Used", 4, 11),
  createItemData(2, "Cribs", "Used", 12, 110),
];

const DonationDetailsOutgoing: React.FC<ModalContentProps> = ({
  selectedDonation,
}) => {
  const [itemRows, setItemRows] = useState<itemTypes[]>(initialItemRows);
  const [editable, setEditable] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [idItemCounter, setIdItemCounter] = useState(2);
  const [idDemoCounter, setIdDemoCounter] = useState(3);

  const dateString = selectedDonation?.date
    ? new Date(selectedDonation.date).toLocaleDateString()
    : "";
  const [demographicRows, setDemographicRows] = useState<demographicTypes[]>(
    initialDemographicRows,
  );

  const handleEditButtonClick = () => {
    setEditable(!editable);
  };

  const handleCancelButtonClick = () => {
    setEditable(false);
    setItemRows(initialItemRows);
    setDemographicRows(initialDemographicRows);
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
    setIdItemCounter(idItemCounter + 1);
  };

  const handleAddDemoButtonClick = () => {
    const hasEmptyFields = demographicRows.some((row) =>
      Object.values(row).some((value) => !value),
    );

    if (hasEmptyFields) {
      console.log(
        "Please fill all fields in the current rows before adding a new row.",
      );
      return;
    }

    setDemographicRows((prevRows) => [
      ...prevRows,
      {
        id: idDemoCounter,
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
      <div
        style={{
          border: "4px solid black",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        <DemographicTable
          rows={demographicRows}
          setRows={setDemographicRows}
          editable={editable}
        />
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

export default DonationDetailsOutgoing;
