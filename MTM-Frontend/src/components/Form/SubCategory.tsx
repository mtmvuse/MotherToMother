/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Stack, Typography, Box, IconButton, Icon } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { items } from "./Items";
import SpecificItems_Dialog from "./SpecificItems-Dialog";
import { useState } from "react";

const isSubCategoryNotEmpty = (subCategory: [number, number]) => {
  return subCategory[0] !== 0 || subCategory[1] !== 0;
};

const handleDelete = (category: string, subCategory: string) => {
  // TODO - Delete from DB
  console.log("Delete " + subCategory + " from " + category);
  items[category]![subCategory] = [0, 0];
};

type SubCategoryProps = {
  category: string;
  subCategoryName: string;
  subCategoryValues: [number, number];
  editMode: boolean;
};

const SubCategory = (props: SubCategoryProps) => {
  if (!isSubCategoryNotEmpty(props.subCategoryValues)) {
    return null;
  }
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Stack
      key={props.subCategoryName}
      direction="row"
      justifyContent="space-between"
      marginY="7px"
      width="95%"
      height="25px"
    >
      <Typography>{props.subCategoryName}</Typography>
      <Typography className="subcategory-status">
        Used: {props.subCategoryValues[0]}
      </Typography>
      <Typography marginRight="15px">
        New: {props.subCategoryValues[1]}
      </Typography>
      {props.editMode && (
        <>
          <IconButton onClick={handleOpenDialog}>
            <EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(props.category, props.subCategoryName)}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
          </IconButton>
        </>
      )}
      <SpecificItems_Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        category={props.category}
        subCategory={props.subCategoryName}
        subCategoryValues={props.subCategoryValues}
      />
    </Stack>
  );
};

export { SubCategory, isSubCategoryNotEmpty };
