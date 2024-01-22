import React from "react";
import { Typography, Stack, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import ReviewSection from "../components/Form/ReviewSection/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection/DemographicSection";
import GeneralSection from "../components/Form/GeneralSection";
import { useForm } from "../contexts/FormContext";

const Form: React.FC = () => {
  const { demographicDetails, donationDetails } = useForm();

  const onSubmit = () => {
    const sum =
      demographicDetails.whiteNum +
      demographicDetails.latinoNum +
      demographicDetails.blackNum +
      demographicDetails.nativeNum +
      demographicDetails.asianNum +
      demographicDetails.otherNum;

    const submitDemographics = {
      ...demographicDetails,
      numberServed: sum,
    };
    console.log(submitDemographics);
  };
  return (
    // Top of Outgoing Donations Form
    <Stack direction="column" alignItems="center" spacing={2}>
      <Typography
        style={{ color: "#004A7C", fontSize: "25px", fontWeight: 700 }}
      >
        Outgoing Donations
      </Typography>
      <Typography fontSize="15px" style={{ textAlign: "center", color: "#6D6D6D"}}>
        Select the categories and item types of resources that you would like to
        donate
      </Typography>

      {/* body of the form calls each component, general section,
      review section and demographic */}
      <Stack
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "max-content",
          paddingBottom: "25%",
          backgroundColor: "white",
        }}
      >
        {/* All form components */}
        <GeneralSection step={1} />
        <ReviewSection step={2} />
        <DemographicSection />
        <Stack justifyContent="center" direction="row" spacing={3}>
          <Button
            onClick={onSubmit}
            type="submit"
            component={Link}
            to="/home/form/success" 
            variant="outlined"
            sx={{ fontSize: 15, background: "#004A7C", color: "white" }}
          >
            SUBMIT
          </Button>
          <Button type="button" variant="outlined" sx={{ fontSize: 15, color: "#004A7C", borderColor: "#004A7C" }}>
            SAVE
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Form;
