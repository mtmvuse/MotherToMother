/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// TODO: REMOVE THIS DISABLE
import React from "react";
import { Typography, Stack } from "@mui/material";

import ReviewSection from "../components/Form/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection";
import GeneralSection from "../components/Form/GeneralSection";

const Form: React.FC = () => {
  return (
    // Top of Outgoing Donations Form
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      style={{ marginTop: "20px" }}
    >
      <Typography fontSize="25px" fontWeight="700">
        Outgoing Donations
      </Typography>
      <Typography fontSize="15px" style={{ textAlign: "center" }}>
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
      </Stack>
    </Stack>
  );
};

export default Form;
