import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { PrimaryMainTheme } from "./Theme";
import { mockItems } from "./ReviewSectionMockItems";
import { ReviewSectionCategory } from "./ReviewSectionCategory";
import { isSubCategoryNotEmpty } from "./ReviewSectionItemEntry";
import NumberInCircle from "./NumberInCircle";
import FormHeader from "./FormHeader";

interface ReviewSectionProps {
  step: number;
}

const getSubCategoryCount = () => {
  let count = 0;
  for (const category in mockItems) {
    for (const subCategory in mockItems[category]) {
      if (isSubCategoryNotEmpty(mockItems[category]![subCategory]!)) {
        count++;
      }
    }
  }
  return count;
};

const ReviewSection = (props: ReviewSectionProps) => {
  const [isEditMode, setisEditMode] = useState(false);

  const handleEdit = () => {
    setisEditMode(true);
  };

  const handleSave = () => {
    setisEditMode(false);
    // TODO: Save the changes to the database
  };

  const handleCancel = () => {
    setisEditMode(false);
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={PrimaryMainTheme}>
        <Box width="85%">
          {/* Header of Review Section */}
          <FormHeader number={props.step} header="Review" />

          {/* Main Content of Review Section */}
          <Stack
            direction="row"
            spacing={1}
            marginY="10px"
            justifyContent="center"
          >
            <NumberInCircle
              num={getSubCategoryCount()}
              backgroundColor="#6D6D6D"
              color="white"
              borderRaduis="10px"
              width="50px"
              height="28px"
              borderWidth="0"
            />
            <Typography variant="body1"> items are in your form </Typography>
          </Stack>
          {Object.keys(mockItems).map((category) => (
            <ReviewSectionCategory
              key={category}
              categoryName={category}
              isEditMode={isEditMode}
            />
          ))}
        </Box>
        {!isEditMode && (
          <Button
            variant="outlined"
            sx={{ fontSize: 15, height: "33px" }}
            onClick={handleEdit}
            style={{ marginTop: "5%" }}
          >
            Edit
          </Button>
        )}
        {isEditMode && (
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              sx={{ fontSize: 15, height: "33px" }}
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "0" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              sx={{ fontSize: 15, height: "33px" }}
              onClick={handleCancel}
              style={{ marginTop: "0" }}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </ThemeProvider>
    </>
  );
};

export default ReviewSection;
