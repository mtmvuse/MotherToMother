import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import ItemsTable from "./ItemsTable";
import DemographicTable from "./DemographicTable";
import {
  DemographicDetails,
  ItemDetails,
  ResponseDonation,
  ItemSelection,
} from "~/types/DonationTypes";
import {
  getDonationDemographics,
  getDonationDetails,
  editOutgoingDonation,
  getModalItems,
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
  const [itemList, setItemList] = useState<ItemSelection[]>([]);
  const [filteredItemList, setFilteredItemList] = useState<ItemSelection[]>([]);
  const [categoryList, setCategoryList] = useState<String[]>([]);
  const [editable, setEditable] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [idItemCounter, setIdItemCounter] = useState(1);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [selectedCategorySelection, setSelectedCategorySelection] =
    useState("");
  const [selectedItemSelection, setSelectedItemSelection] =
    useState<ItemSelection | null>(null);

  useEffect(() => {
    if (itemRows.length > 0) {
      setIdItemCounter(Math.max(...itemRows.map((item) => item.id)) + 1);
    }
  }, [itemRows]);

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getModalItems();
        if (response.ok) {
          const data = await response.json();
          const fetchedItems: ItemSelection[] = data.map(
            (items: ItemSelection) => ({
              name: items.name,
              category: items.category,
              valueNew: items.valueNew,
              valueUsed: items.valueUsed,
            })
          );
          const fetchedCategories: string[] = Array.from(
            new Set(data.map((items: ItemSelection) => items.category))
          );
          setItemList(fetchedItems);
          setCategoryList(fetchedCategories);
        } else {
          throw new Error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedCategorySelection) {
      const filteredItems = itemList.filter(
        (item) => item.category === selectedCategorySelection
      );
      setFilteredItemList(filteredItems);
    } else {
      setFilteredItemList(itemList);
    }
  }, [selectedCategorySelection, itemList]);

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

  const handleItemSelectionChange = (event: SelectChangeEvent<string>) => {
    const selectedItem = itemList.find(
      (item) => item.name === event.target.value
    );
    setSelectedItemSelection(selectedItem || null);
  };

  const handleCategorySelectionChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategorySelection(event.target.value as string);
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
        setEditable(false);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelConfirm = () => {
    setOpenConfirmDialog(false);
  };

  const handleAddItemButtonClick = () => {
    const hasEmptyFields = itemRows.some(
      (row) => row.quantityNew === 0 && row.quantityUsed === 0
    );
    if (hasEmptyFields) {
      console.log(
        "Please fill all fields in the current rows before adding a new row."
      );
    } else {
      setOpenAddItemDialog(true);
    }
  };

  const handleAddDialog = () => {
    if (!selectedItemSelection) {
      return;
    }

    setItemRows((prevRows) => [
      ...prevRows,
      {
        id: idItemCounter + 1,
        name: selectedItemSelection.name,
        valueNew: selectedItemSelection.valueNew || 0,
        valueUsed: selectedItemSelection.valueUsed || 0,
        quantityNew: 0,
        quantityUsed: 0,
      },
    ]);
    setIdItemCounter(idItemCounter + 1);
    setOpenAddItemDialog(false);
    setSelectedCategorySelection("");
    setSelectedItemSelection(null);
  };

  const handleCloseAddItemDialog = () => {
    setSelectedCategorySelection("");
    setSelectedItemSelection(null);
    setOpenAddItemDialog(false);
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
      <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="item-type-label">Item Type</InputLabel>
            <Select
              labelId="item-type-label"
              id="item-type"
              value={selectedCategorySelection}
              onChange={handleCategorySelectionChange}
              label="Item Type"
            >
              {categoryList.map((category, index) => (
                <MenuItem key={index} value={category.toString()}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedCategorySelection}>
            <InputLabel id="item-type-label">Item Type</InputLabel>
            <Select
              labelId="item-type-label"
              id="item-type"
              value={selectedItemSelection ? selectedItemSelection.name : ""}
              onChange={handleItemSelectionChange}
              label="Item Type"
            >
              {filteredItemList.map((item) => (
                <MenuItem value={item.name}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddItemDialog}>Cancel</Button>
          <Button
            onClick={() => {
              handleAddDialog();
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
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
