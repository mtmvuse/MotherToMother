import React from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";
import { Box } from "@mui/material";
import { SVG1, SVG2, SVG3, SVG4, SVG5 } from "./CustomSVGContactUsAccordion";

// style for outermost green contact boxes
const boxStyle = {
  width: "357px",
  height: "97px",
  top: "398px",
  left: "38px",
  backgroundColor: "#4DAD45",
  display: "flex",
} as const;

// style for white box inside green contact boxes
const innerBoxStyle = {
  width: "204px",
  height: "70px",
  marginTop: "13.5px",
  backgroundColor: "#EBF6E9",
  display: "flex",
} as const;

// style for "Contact Us, Address and Drop off Hours" text
const innerTextStyle = {
  width: "80px",
  height: "18px",
  marginLeft: "29.5px",
  marginRight: "30px",
  fontFamily: "Raleway",
  fontSize: "15px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0em",
  textAlign: "center",
  color: "#FFFFFF",
} as const;

// style for all icons on the left of text inside each white box
const innerBoxIconStyle = {
  color: "black",
  fontSize: "12px",
  fontFamily: "Raleway",
  fontWeight: "400",
  wordWrap: "break-word",
  margin: "14px 10px 14px 14px",
} as const;

// style for all text inside of the white boxes
const innerBoxTextStyle = {
  color: "black",
  fontSize: "12px",
  fontFamily: "Raleway",
  fontWeight: "400",
  wordWrap: "break-word",
  width: "166px",
  margin: "14px 0px 14px",
} as const;

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
          customStyles={{ backgroundColor: "#bbf7d0" }}
        >
          <Typography className="square-button">CONTACT & HOURS</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#bbf7d0" }}>
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

export { ContactUsAccordion };
