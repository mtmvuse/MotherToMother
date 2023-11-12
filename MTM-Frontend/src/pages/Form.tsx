/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// TODO: REMOVE THIS DISABLE
import React from "react";
import { Typography, Stack, Button } from "@mui/material";
import ReviewSection from "../components/Form/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection";

const Profile: React.FC = () => {
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

      <ReviewSection />

      <DemographicSection />
    </Stack>
  );
};

export default Profile;
