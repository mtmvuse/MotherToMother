import { Box, Container, Stack, Typography } from "@mui/material";
import { items, itemType } from "./Items";
import { SubCategory } from "./SubCategory";
import React from "react";

type categoryType = {
  [key: string]: [number, number];
};

const isCategoryNotEmpty = (category: categoryType) => {
  return Object.values(category).some(
    ([used, newCount]) => used !== 0 || newCount !== 0,
  );
};

type CategoryProps = {
  categoryName: string;
  editMode: boolean;
};

const Category: React.FC<CategoryProps> = ({ categoryName, editMode }) => {
  const categoryData = items[categoryName] as itemType[string];

  if (!isCategoryNotEmpty(categoryData)) {
    return null;
  }

  return (
    <Box key={categoryName}>
      <Container
        sx={{
          backgroundColor: "primary.main",
          borderRadius: "5px",
          height: "25px",
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <Typography color="white">{categoryName}</Typography>
      </Container>

      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={0.5}
      >
        {Object.keys(categoryData).map((subCategory) => (
          <SubCategory
            key={subCategory}
            category={categoryName}
            subCategoryName={subCategory}
            subCategoryValues={categoryData[subCategory]}
            editMode={editMode}
          />
        ))}
      </Stack>
    </Box>
  );
};

export { Category };
