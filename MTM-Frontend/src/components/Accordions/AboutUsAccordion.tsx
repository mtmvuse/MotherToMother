import React from "react";
import { Box, Typography } from "@mui/material/";
import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";
import "./Accordions.css";

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
      >
        <AccordionSummary
          aria-controls="about-panel-content"
          id="about-header"
          customStyles={{ backgroundColor: "#A6C8DE" }}
        >
          <Typography className="square-button">ABOUT US</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#A6C8DE" }}>
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            id="about-us"
          >
            <Box width="83%">
              <Typography id="about-us-accordion-text-1">
                For almost two decades, Nashville-based Mother To Mother has
                been working to ensure children in our community have access to
                three basic essentials that often slip through the cracks of
                government subsidies and charitable support:
              </Typography>

              <ul id="about-us-list">
                <li>
                  <Typography className="about-us-item">diapers</Typography>
                </li>
                <li>
                  <Typography className="about-us-item">car seats</Typography>
                </li>
                <li>
                  <Typography className="about-us-item">
                    a safe place to sleep
                  </Typography>
                </li>
              </ul>

              <Typography id="about-us-accordion-text-2">
                <b>By working with our agency partners</b> such as hospitals,
                domestic violence centers. homeless shelters and many others, we
                are able to reach those in the community that are most in need.
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export { AboutUsAccordion };
