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

  const getDonationCategories = () => {
    return Array.from(new Set(donationDetails.map((item) => item.category)));
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
              backgroundColor="var(--mtmNavy)"
              color="white"
              borderRaduis="10px"
              width="50px"
              height="28px"
              borderWidth="0"
            />
            <Typography variant="body1"> items are in your form </Typography>
          </Stack>
          {getDonationCategories().map((category, i) => (
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
            sx={{
              fontSize: 15,
              height: "33px",
              color: "#004A7C",
              borderColor: "#004A7C",
            }}
            onClick={handleEdit}
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              color: "var(--mtmNavy)",
              border: "1px solid var(--mtmNavy)",
              fontFamily: " Inter, sans-serif",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            EDIT
          </Button>
        )}
        {isEditMode && (
          <Stack direction="row" spacing={3}>
            <Button
              variant="outlined"
              sx={{
                fontSize: 15,
                height: "33px",
                backgroundColor: "#004A7C", // Replace with your desired background color
                color: "white", // Replace with your desired text color
              }}
              color="primary"
              onClick={handleSave}
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                backgroundColor: "var(--mtmNavy)",
                color: "white",
                height: "32px",
                width: "87px",
                fontFamily: " Inter, sans-serif",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              SAVE
            </Button>
            <Button
              variant="outlined"
              sx={{
                fontSize: 15,
                height: "33px",
                color: "#004A7C",
                borderColor: "#004A7C",
              }}
              onClick={handleCancel}
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                color: "var(--mtmNavy)",
                border: "1px solid var(--mtmNavy)",
                fontFamily: " Inter, sans-serif",
                fontSize: "15px",
                fontWeight: "800",
              }}
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
