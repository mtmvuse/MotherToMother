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
  editOutgoingDonation,
} from "../../lib/services";

// TODO Cleanup
// TODO Add global erros
// TODO Add dialoge for add item row
// Remove Add Demographic
// TODO Styling

interface ModalContentProps {
  selectedDonation: ResponseDonation;
}

const DonationDetailsOutgoing: React.FC<ModalContentProps> = ({
  selectedDonation,
}) => {
  const [itemRows, setItemRows] = useState<ItemDetails[]>([]);
  const [initialItemRows, setInitialItemRows] = useState<ItemDetails[]>([]);
  const [initialDemographicRows, setInitialDemographicRows] = useState<
    DemographicDetails[]
  >([]);

  const [demographicRows, setDemographicRows] = useState<DemographicDetails[]>(
    []
  );
  const [editable, setEditable] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [idItemCounter, setIdItemCounter] = useState(1);
  const [idDemoCounter, setIdDemoCounter] = useState(1);

  useEffect(() => {
    if (itemRows.length > 0) {
      setIdItemCounter(Math.max(...itemRows.map((item) => item.id)) + 1);
    }

    if (demographicRows.length > 0) {
      setIdDemoCounter(Math.max(...demographicRows.map((demo) => demo.id)) + 1);
    }
  }, [itemRows, demographicRows]);

  useEffect(() => {
    const fetchItemRows = async () => {
      try {
        const response = await getDonationDetails(selectedDonation.id);
        if (response.ok) {
          const data = await response.json();
          const fetchedData: ItemDetails[] = data.map(
            (itemData: ItemDetails) => ({
              id: itemData.id,
              name: itemData.name,
              quantityNew: itemData.quantityNew,
              quantityUsed: itemData.quantityUsed,
              valueNew: itemData.valueNew,
              valueUsed: itemData.valueUsed,
            })
          );
          setItemRows(fetchedData);
          setInitialItemRows(fetchedData);
        } else {
          throw new Error("Failed to fetch item rows");
        }
      } catch (error) {
        console.error("Error fetching item rows:", error);
      }
    };

    const fetchDemographicRows = async () => {
      try {
        const response = await getDonationDemographics(selectedDonation.id);
        if (response.ok) {
          const data = await response.json();
          const fetchedData: DemographicDetails[] = [
            { id: 1, kidGroup: "White children", quantity: data.whiteNum },
            { id: 2, kidGroup: "Latino children", quantity: data.latinoNum },
            { id: 3, kidGroup: "Black children", quantity: data.blackNum },
            { id: 4, kidGroup: "Native children", quantity: data.nativeNum },
            { id: 5, kidGroup: "Asian children", quantity: data.asianNum },
            { id: 6, kidGroup: "Other children", quantity: data.otherNum },
          ];
          setDemographicRows(fetchedData);
          setInitialDemographicRows(fetchedData);
        } else {
          throw new Error("Failed to fetch demographic rows");
        }
      } catch (error) {
        console.error("Error fetching demographic rows:", error);
      }
    };

    fetchItemRows();
    fetchDemographicRows();
  }, [selectedDonation]);

  const dateString = selectedDonation?.date
    ? new Date(selectedDonation.date).toLocaleDateString()
    : "";

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

  const totalQuantity = demographicRows
    .filter((row) => row.kidGroup)
    .reduce((total, row) => total + row.quantity, 0);

  const handleConfirmSave = async () => {
    try {
      const response = await editOutgoingDonation(selectedDonation.id, {
        numberServed: totalQuantity,

        whiteNum:
          demographicRows.find((row) => row.kidGroup === "White children")
            ?.quantity || 0,
        latinoNum:
          demographicRows.find((row) => row.kidGroup === "Latino children")
            ?.quantity || 0,
        blackNum:
          demographicRows.find((row) => row.kidGroup === "Black children")
            ?.quantity || 0,
        nativeNum:
          demographicRows.find((row) => row.kidGroup === "Native children")
            ?.quantity || 0,
        asianNum:
          demographicRows.find((row) => row.kidGroup === "Asian children")
            ?.quantity || 0,
        otherNum:
          demographicRows.find((row) => row.kidGroup === "Other children")
            ?.quantity || 0,
        donationDetails: itemRows.map((item) => ({
          item: item.name,
          usedQuantity: item.quantityNew,
          newQuantity: item.quantityUsed,
        })),
      });

      if (response.ok) {
        setInitialItemRows(itemRows);
        setInitialDemographicRows(demographicRows);
        setOpenConfirmDialog(false);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error
    }
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
