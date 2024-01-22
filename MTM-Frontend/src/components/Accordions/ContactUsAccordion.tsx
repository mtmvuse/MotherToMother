import React from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";

type ContactUsAccordionProps = {
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
};

const ContactUsAccordion: React.FC<ContactUsAccordionProps> = ({
  expanded,
  handleChange,
}) => {
  return (
    <>
      <Accordion
        expanded={expanded === "contact"}
        onChange={handleChange("contact")}
        customStyles={{}}
      >
        <AccordionSummary
          aria-controls="contact-panel-content"
          id="contact-header"
          customStyles={{ backgroundColor: "#F6FBF5" }}
        >
          <Typography className="square-button">CONTACT & HOURS</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#F6FBF5" }}>
          <Typography>
            For almost two decades, Nashville-based Mother To Mother has been
            working to ensure children in our community have access to three
            basic essentials that often slip through the cracks of government
            subsidies and charitable support:​ diapers car seats a safe place to
            sleep
          </Typography>

          <div className="hours-container">
            <div className="hours-section">
              <h2>Warehouse Hours</h2>
              <p>Monday - Thursday: 1:00pm - 4:30pm</p>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export { ContactUsAccordion };
