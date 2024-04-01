import React from "react";
import { Typography, Button } from "@mui/material";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";

type DonateAccordionProps = {
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
};

const DonateAccordion: React.FC<DonateAccordionProps> = ({
  expanded,
  handleChange,
}) => {
  return (
    <>
      <Accordion
        expanded={expanded === "donate"}
        onChange={handleChange("donate")}
        customStyles={{}}
      >
        <AccordionSummary
          aria-controls="donate-panel-content"
          id="donate-header"
          customStyles={{ backgroundColor: "#EBF6E9" }}
        >
          <Typography className="square-button">Donate</Typography>
        </AccordionSummary>
        <AccordionDetails
          customStyles={{
            backgroundColor: "#EBF6E9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography>
            Join Mother To Mother's mission to help families thrive by providing
            car seats, diapers, cribs, and other essential resources so that
            under-resourced children in our community can be safe and healthy.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="https://buy.stripe.com/3csbLc7SE2Z3bxm3cc"
            style={{
              marginTop: "15px",
              marginBottom: "15px",
              backgroundColor: "var(--mtmNavy)",
              color: "white",
              height: "32px",
              width: "150px",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            Donate Here
          </Button>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export { DonateAccordion };
