import React, { useState } from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";

import { AboutUsAccordion } from "./AboutUsAccordion";
import { ImpactAccordion } from "./ImpactAccordion";
import { ContactUsAccordion } from "./ContactUsAccordion";
import { DonateAccordion } from "./DonateAccordion";

const AccordionsLayout: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>("about us");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <>
      <AboutUsAccordion expanded={expanded} handleChange={handleChange} />

      <ImpactAccordion expanded={expanded} handleChange={handleChange} />

      <ContactUsAccordion expanded={expanded} handleChange={handleChange} />

      <DonateAccordion expanded={expanded} handleChange={handleChange} />
    </>
  );
};

export default AccordionsLayout;
