import React from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";
import { Stack, Box } from "@mui/material";
import impactImg1 from "../../pages/assets/impact-accordion1.svg";
import impactImg2 from "../../pages/assets/impact-accordion2.svg";
import impactImg3 from "../../pages/assets/impact-accordion3.svg";
import "./Accordions.css";

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
          customStyles={{ backgroundColor: "#EEF4F8" }}
        >
          <Typography className="square-button">IMPACT</Typography>
        </AccordionSummary>
        <AccordionDetails
          customStyles={{
            backgroundColor: "#EEF4F8",
          }}
        >
          <Box id="impact-accordion-main-text">
            <Typography align="justify" width="83%" marginBottom={3}>
              We believe no child should grow up without basic childcare
              essentials. That's why MTM connects families with supplies and
              loving support they need to keep their childern healthy and safe.
            </Typography>
          </Box>

          <ImpactStats
            title="4.1. Million Diapers"
            subtitle="donated to babies in need"
            image={impactImg1}
          />
          <ImpactStats
            title="7,264 Car Seats"
            subtitle="installed to take newborns home safely"
            image={impactImg2}
          />
          <ImpactStats
            title="8,832 Cribs"
            subtitle="and Pack'n Plays provided for safe places to sleep"
            image={impactImg3}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

type ImpactStatsProps = {
  title: string;
  subtitle: string;
  image: string;
};

const ImpactStats: React.FC<ImpactStatsProps> = ({
  title,
  subtitle,
  image,
}) => {
  return (
    <Box
      width="100%"
      justifyContent="center"
      display="flex"
      id="impact-stats-box"
    >
      <Stack id="impact-stats-stack" direction="row" spacing={2}>
        <Box width="30%" justifyContent="left" display="flex">
          <img src={image} alt="impact stat" />
        </Box>
        <Stack width="70%" justifyContent="center" display="flex">
          <Typography variant="h5" id="impact-stats-title">
            {title}
          </Typography>
          <Typography variant="h6" id="impact-stats-subtitle">
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export { ImpactAccordion };
