import React, { useState } from "react";
import { Typography, Stack, Button } from "@mui/material";

import ReviewSection from "../components/Form/ReviewSection/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection/DemographicSection";
import GeneralSection from "../components/Form/GeneralSection";
import { useForm } from "../contexts/FormContext";
import { useAuth } from "../contexts/AuthContext";
import { createOutgoingDonation } from "../lib/services";
import { ErrorMessage } from "../components/Error";

const Form: React.FC = () => {
  const { demographicDetails, donationDetails } = useForm();
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true); // Disables the submit button.

    demographicDetails.numberServed =
      demographicDetails.whiteNum +
      demographicDetails.latinoNum +
      demographicDetails.blackNum +
      demographicDetails.nativeNum +
      demographicDetails.asianNum +
      demographicDetails.otherNum;

    try {
      if (!currentUser) {
        throw new Error("Unable to fetch User");
      }

      const token = await currentUser.getIdToken();

      const request = {
        email: currentUser.email,
        donationDetails: donationDetails,
        ...demographicDetails,
      };

      await createOutgoingDonation(token, request);
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setIsLoading(false); // Enables the submit button
    }
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
        <DemographicSection />
        <ErrorMessage error={error} setError={setError} />
        <Stack justifyContent="center" direction="row" spacing={3}>
          <Button
            onClick={onSubmit}
            type="submit"
            variant="outlined"
            sx={{ fontSize: 15 }}
            disabled={isLoading}
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
