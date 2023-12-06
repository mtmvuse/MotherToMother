import { Box, Container, Stack, Typography } from "@mui/material";
import { ReviewSectionItemEntry } from "./ReviewSectionItemEntry";
import React from "react";
import { useForm } from "../../contexts/FormContext";

type ReviewSectionCategoryProps = {
  categoryName: string;
  isEditMode: boolean;
};

const ReviewSectionCategory: React.FC<ReviewSectionCategoryProps> = ({
  categoryName,
  isEditMode,
}) => {
  // TODO update this to context state
  const { donationDetails } = useForm();
  const categoryData = donationDetails.filter(
    (item) => item.category === categoryName,
  );

  if (categoryData.length === 0) {
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
        {categoryData.map((item, i) => (
          <ReviewSectionItemEntry
            key={i}
            donationDetail={item}
            isEditMode={isEditMode}
          />
        ))}
      </Stack>
    </Box>
  );
};

export { ReviewSectionCategory };
