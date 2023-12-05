import { Box, Container, Stack, Typography } from "@mui/material";
import { mockItems } from "./ReviewSectionMockItems";
import { ReviewSectionItemEntry } from "./ReviewSectionItemEntry";
import React from "react";
import type { itemType } from "../../types/FormTypes";

const isCategoryNotEmpty = (category: itemType) => {
  return Object.values(category).some(
    ([used, newCount]) => used !== 0 || newCount !== 0,
  );
};

type ReviewSectionCategoryProps = {
  categoryName: string;
  isEditMode: boolean;
};

const ReviewSectionCategory: React.FC<ReviewSectionCategoryProps> = ({
  categoryName,
  isEditMode,
}) => {
  // TODO update this to context state
  const categoryData = mockItems[categoryName]!;

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
        {Object.keys(categoryData).map((item) => (
          <ReviewSectionItemEntry
            key={item}
            category={categoryName}
            item={item}
            itemValues={categoryData[item]!}
            isEditMode={isEditMode}
          />
        ))}
      </Stack>
    </Box>
  );
};

export { ReviewSectionCategory };
