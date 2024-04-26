import React, { useState } from "react";
import { Typography, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/Form/ReviewSection/ReviewSection";
import DemographicSection from "../components/Form/DemographicSection/DemographicSection";
import GeneralSection from "../components/Form/GeneralSection";
import { useForm } from "../contexts/FormContext";
import { useAuth } from "../contexts/AuthContext";
import { createOutgoingDonation } from "../lib/services";
import { ErrorMessage } from "../components/Error";

const Form: React.FC = () => {
  const {
    demographicDetails,
    donationDetails,
    setDemographicDetails,
    setDonationDetails,
  } = useForm();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currPanel, setCurrPanel] = useState<string>("GeneralSection");

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

      if (demographicDetails.numberServed === 0) {
        throw new Error(
          "Please enter demographic details this donation serves.",
        );
      }

      const token = await currentUser.getIdToken();

      const request = {
        email: currentUser.email,
        donationDetails: donationDetails,
        ...demographicDetails,
      };

      const response = await createOutgoingDonation(token, request);
      if (response.status === 500) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const message = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new Error(message.message as string);
      }
      // reset form
      setDemographicDetails({
        whiteNum: 0,
        blackNum: 0,
        latinoNum: 0,
        nativeNum: 0,
        asianNum: 0,
        otherNum: 0,
        numberServed: 0,
      });
      setDonationDetails([]);
      navigate("/home/form/success");
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    // Top of Outgoing Donations Form
    <Stack
      direction="column"
      alignItems="center"
      spacing={2}
      style={{ marginTop: "50px" }}
    >
      <Typography
        fontSize="25px"
        fontWeight="700"
        style={{ fontFamily: "Raleway, sans-serif", color: "var(--mtmNavy)" }}
      >
        Outgoing Donations
      </Typography>
      <Typography
        fontSize="15px"
        style={{
          textAlign: "center",
          fontFamily: "Raleway, sans-serif",
          fontWeight: "400",
          color: "var(--mtmGray)",
        }}
      >
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
        <div
          style={{
            filter: `${
              currPanel !== "GeneralSection"
                ? "grayscale(100%) opacity(50%)"
                : ""
            }`,
            width: "85%",
          }}
        >
          <GeneralSection
            step={1}
            currPanel={currPanel}
            setCurrPanel={setCurrPanel}
          />
        </div>

        <div
          style={{
            filter: `${
              currPanel !== "ReviewSection"
                ? "grayscale(100%) opacity(50%)"
                : ""
            }`,
            width: "85%",
          }}
        >
          <ReviewSection
            step={2}
            currPanel={currPanel}
            setCurrPanel={setCurrPanel}
          />
        </div>

        <div
          style={{
            filter: `${
              currPanel !== "DemographicSection"
                ? "grayscale(100%) opacity(50%)"
                : ""
            }`,
            width: "85%",
          }}
        >
          <DemographicSection
            currPanel={currPanel}
            setCurrPanel={setCurrPanel}
          />
        </div>

        <ErrorMessage error={error} setError={setError} />
        <Stack justifyContent="center" direction="row" spacing={3}>
          <Button
            onClick={onSubmit}
            type="submit"
            variant="outlined"
            sx={{
              fontFamily: "Interit, sans-serif",
              fontSize: "15px",
              fontWeight: "800",
              backgroundColor: "var(--mtmNavy)",
              color: "white",
              height: "32px",
              width: "87px",
            }}
            disabled={isLoading}
          >
            SUBMIT
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Form;
