import React from "react";
import Typography from "@mui/material/Typography";

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
        <AccordionDetails customStyles={{ backgroundColor: "#EBF6E9" }}>
          <Typography>
            For almost two decades, Nashville-based Mother To Mother has been
            working to ensure children in our community have access to three
            basic essentials that often slip through the cracks of government
            subsidies and charitable support:​ diapers car seats a safe place to
            sleep
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export { DonateAccordion };
