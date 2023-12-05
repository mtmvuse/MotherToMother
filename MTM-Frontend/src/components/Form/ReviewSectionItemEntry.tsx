/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Stack, Typography, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { mockItems } from "./ReviewSectionMockItems";
import { SpecificItemsDialog } from "./SpecificItemsDialog";
import { useState } from "react";

const isSubCategoryNotEmpty = (subCategory: [number, number]) => {
  return subCategory[0] !== 0 || subCategory[1] !== 0;
};

const handleDelete = (category: string, subCategory: string) => {
  // TODO - Delete from DB
  console.log("Delete " + subCategory + " from " + category);
  mockItems[category]![subCategory] = [0, 0];
};

type ReviewSectionItemEntryProps = {
  category: string;
  item: string;
  itemValues: [number, number];
  isEditMode: boolean;
};

const ReviewSectionItemEntry = (props: ReviewSectionItemEntryProps) => {
  const { category, item, itemValues, isEditMode } = props;
  if (!isSubCategoryNotEmpty(itemValues)) {
    return null;
  }
  const [openDialog, setOpenDialog] = useState(false);
  const [itemValuesState, setItemValuesState] = useState(itemValues);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Stack
      key={item}
      direction="row"
      justifyContent="space-between"
      marginY="7px"
      width="95%"
      height="25px"
    >
      <Typography>{item}</Typography>
      <Typography className="subcategory-status">
        Used: {itemValues[0]}
      </Typography>
      <Typography marginRight="15px">New: {itemValues[1]}</Typography>
      {isEditMode && (
        <>
          <IconButton onClick={handleOpenDialog}>
            <EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(category, item)}>
            <DeleteOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
          </IconButton>
        </>
      )}
      <SpecificItemsDialog
        open={openDialog}
        onClose={handleCloseDialog}
        category={category}
        item={item}
        itemValues={itemValuesState}
        setItemValues={setItemValuesState}
      />
    </Stack>
  );
};

export { ReviewSectionItemEntry, isSubCategoryNotEmpty };
