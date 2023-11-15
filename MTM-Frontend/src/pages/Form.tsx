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
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h4" fontWeight="bold">
        Outgoing Donations
      </Typography>
      <Typography variant="body1">
        Select the categories and item types of resources that you would like to
        donate
      </Typography>
      <GeneralSection step={1} />

      <ReviewSection step={2} />

      <DemographicSection />
    </Stack>
  );
};

export default Form;
