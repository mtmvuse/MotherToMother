/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// TODO: REMOVE THIS DISABLE
import React from "react";
import { Typography, Stack, Button } from "@mui/material";
import Badge from "@mui/material/Badge";

import Categories from "../components/Form/Categories";
import ReviewSection from "../components/Form/ReviewSection";
import GeneralSection from "../components/Form/GeneralSection";

const Profile: React.FC = () => {
  return (
    <div>
      {/* <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h3">Outgoing Donations</Typography>
        <Typography variant="body1">
          Select the categories and item types of resources that you would like
          to donate
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <NumberInCircle num={1} />
          <Typography variant="h5">Choose a category</Typography>
        </Stack>
        <Categories />
      </Stack> */}
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

function NumberInCircle({ num }: any) {
  return (
    <Badge
      badgeContent={num}
      color="primary"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    ></Badge>
  );
}

export default Profile;
