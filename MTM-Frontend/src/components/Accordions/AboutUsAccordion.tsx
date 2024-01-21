import React, { useState } from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";

type AboutUsAccordionProps = {
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
};

const AboutUsAccordion: React.FC<AboutUsAccordionProps> = ({
  expanded,
  handleChange,
}) => {
  return (
    <>
      <Accordion
        expanded={expanded === "about us"}
        onChange={handleChange("about us")}
        customStyles={{}}
      >
        <AccordionSummary
          aria-controls="about-panel-content"
          id="about-header"
          customStyles={{ backgroundColor: "#bae6fd" }}
        >
          <Typography className="square-button">ABOUT US</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#bae6fd" }}>
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

export { AboutUsAccordion };
