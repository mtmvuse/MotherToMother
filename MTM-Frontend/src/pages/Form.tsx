/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// TODO: REMOVE THIS DISABLE
import React from "react";
import { Typography, Stack } from "@mui/material";

import ReviewSection from "../components/Form/ReviewSection";
import GeneralSection from "../components/Form/GeneralSection";

const Profile: React.FC = () => {
  return (
    <div>
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
          Select the categories and item types of resources that you would like
          to donate
        </Typography>
        <ReviewSection />
      </Stack>
    </div>
  );
};

export default Profile;
