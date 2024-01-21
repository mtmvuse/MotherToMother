import React, { useState } from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";

type ImpactAccordionProps = {
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
};

const ImpactAccordion: React.FC<ImpactAccordionProps> = ({
  expanded,
  handleChange,
}) => {
  return (
    <>
      <Accordion
        expanded={expanded === "impact"}
        onChange={handleChange("impact")}
        customStyles={{}}
      >
        <AccordionSummary
          aria-controls="impact-panel-content"
          id="impact-header"
          customStyles={{ backgroundColor: "#f5f5f5" }}
        >
          <Typography className="square-button">IMPACT</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#f5f5f5" }}>
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

export { ImpactAccordion };
