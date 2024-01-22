import {
  CssBaseline,
  ThemeProvider,
  Typography,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { PrimaryMainTheme } from "../Theme";
import { ReviewSectionCategory } from "./ReviewSectionCategory";
import NumberInCircle from "./NumberInCircle";
import FormHeader from "../FormHeader";
import { useForm } from "../../../contexts/FormContext";
import { GeneralCategories } from "../../../lib/constants";

interface ReviewSectionProps {
  step: number;
}

const ReviewSection = (props: ReviewSectionProps) => {
  const { donationDetails } = useForm();
  const [isEditMode, setisEditMode] = useState(false);

  const handleEdit = () => {
    setisEditMode(true);
  };

  const handleSave = () => {
    setisEditMode(false);
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
              num={donationDetails.length}
              backgroundColor="#004A7C"
              color="white"
              borderRaduis="10px"
              width="50px"
              height="28px"
              borderWidth="0"
            />
            <Typography variant="body1"> items are in your form </Typography>
          </Stack>
          {GeneralCategories.map((category, i) => (
            <ReviewSectionCategory
              key={i}
              categoryName={category}
              isEditMode={isEditMode}
            />
          ))}
        </Box>
        {!isEditMode && (
          <Button
            variant="outlined"
            sx={{ fontSize: 15, height: "33px", color: "#004A7C", borderColor: "#004A7C" }}
            onClick={handleEdit}
            style={{ marginTop: "5%" }}
          >
            EDIT
          </Button>
        )}
        {isEditMode && (
          <Stack direction="row" spacing={3}>
            <Button
              variant="contained"
              sx={{
                fontSize: 15,
                height: "33px",
                backgroundColor: "#004A7C", // Replace with your desired background color
                color: "white", // Replace with your desired text color
              }}
              color="primary"
              onClick={handleSave}
              style={{ marginTop: "0" }}
            >
              SAVE
            </Button>
            <Button
              variant="outlined"
              sx={{ fontSize: 15, height: "33px", color: "#004A7C", borderColor: "#004A7C" }}
              onClick={handleCancel}
              style={{ marginTop: "0" }}
            >
              CANCEL
            </Button>
          </Stack>
        )}
      </ThemeProvider>
    </>
  );
};

export default ReviewSection;
