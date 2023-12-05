import React, { useState } from "react";
import { Typography, Stack, Button } from "@mui/material";

import ReviewSection from "../components/Form/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection";
import GeneralSection from "../components/Form/GeneralSection";
import type { DemographicDetailType } from "../types/FormTypes";
import type { DonationDetailType } from "../types/FormTypes";

const Form: React.FC = () => {
  const [donationDetails, setDonationDetails] = useState<DonationDetailType[]>(
    [],
  );
  const [demographicDetails, setDemographicDetails] =
    useState<DemographicDetailType>({
      numberServed: 0,
      whiteNum: 0,
      latinoNum: 0,
      blackNum: 0,
      nativeNum: 0,
      asianNum: 0,
      otherNum: 0,
    });
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
  };
  return (
    // Top of Outgoing Donations Form
    <Stack direction="column" alignItems="center" spacing={2}>
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
        <DemographicSection setDemographicDetails={setDemographicDetails} />
        <Stack justifyContent="center" direction="row" spacing={3}>
          <Button
            onClick={onSubmit}
            type="submit"
            variant="outlined"
            sx={{ fontSize: 15 }}
          >
            Submit
          </Button>
          <Button type="button" variant="outlined" sx={{ fontSize: 15 }}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Form;
