/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Stack, Typography, Box, IconButton, Icon } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { items } from "./Items";
import SpecificItems_Dialog from "./SpecificItems-Dialog";
import { useState } from "react";

const getSubCategories = (
  category: string,
  subCategory: string,
  subCategoryValues: [number, number],
  editMode: boolean,
  handleOpenDialog: () => void,
) => {
  if (isSubCategoryNotEmpty(subCategoryValues)) {
    return (
      <div>
        <Stack
          key={subCategory}
          direction="row"
          justifyContent="space-between"
          marginY="7px"
          width="95%"
        >
          <Typography className="subcategory-status">
            {subCategory}
          </Typography>
          <Typography className="subcategory-status">
            Used: {subCategoryValues[0]}
          </Typography>
          <Stack direction="row">
            <Typography className="subcategory-status" marginRight="15px">
              New: {subCategoryValues[1]}
            </Typography>
            {editMode && (
              <>
                <IconButton onClick={handleOpenDialog}>
                  <EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(category, subCategory)}>
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>
      </div>
    );
  }
};

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
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <div>
      {getSubCategories(
        props.category,
        props.subCategoryName,
        props.subCategoryValues,
        props.editMode,
        handleOpenDialog,
      )}
      <SpecificItems_Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        category={props.category}
        subCategory={props.subCategoryName}
        subCategoryValues={props.subCategoryValues}
      />
    </div>
  );
};

export { SubCategory, isSubCategoryNotEmpty };
