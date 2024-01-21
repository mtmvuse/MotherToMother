import React, { useState } from "react";
import m2m_logo from "../../pages/assets/m2m_logo.png";
import "./Home.css";

import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails, {
  AccordionDetailsProps,
} from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

// Add common styles shared between all inside these variables.
// I added a customStyles that you can indivdually edit the components
// it is an object similar to styles={{}}
interface AccordionSummaryStyledProps extends AccordionSummaryProps {
  customStyles?: React.CSSProperties;
}

interface AccordionStyledProps extends AccordionProps {
  customStyles?: React.CSSProperties;
}

interface AccordionDetailsStyledProps extends AccordionDetailsProps {
  customStyles?: React.CSSProperties;
}

const Accordion = styled(({ customStyles, ...props }: AccordionStyledProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({}));

const AccordionSummary = styled(
  ({ customStyles, ...props }: AccordionSummaryStyledProps) => (
    <MuiAccordionSummary {...props} />
  ),
)(({ theme, customStyles }) => ({
  padding: 0,
  ...customStyles,
}));

const AccordionDetails = styled(
  ({ customStyles, ...props }: AccordionDetailsStyledProps) => (
    <MuiAccordionDetails {...props} />
  ),
)(({ theme, customStyles }) => ({
  // Your default styles here
  ...customStyles,
}));

const Home: React.FC = () => {
  const [showContact, setShowContact] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>("about us");

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <div className={"main-container"}>
      <div className={"logo-image"}>
        <img className="m2m_logo" src={m2m_logo} alt="m2m_logo" />
      </div>
      <div className="button-column">
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
              subsidies and charitable support:​ diapers car seats a safe place
              to sleep
            </Typography>
          </AccordionDetails>
        </Accordion>

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
              subsidies and charitable support:​ diapers car seats a safe place
              to sleep
            </Typography>
          </AccordionDetails>
        </Accordion>

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
              subsidies and charitable support:​ diapers car seats a safe place
              to sleep
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "donate"}
          onChange={handleChange("donate")}
          customStyles={{}}
        >
          <AccordionSummary
            aria-controls="donate-panel-content"
            id="donate-header"
            customStyles={{ backgroundColor: "#dcfce7" }}
          >
            <Typography className="square-button">Donate</Typography>
          </AccordionSummary>
          <AccordionDetails customStyles={{ backgroundColor: "#dcfce7" }}>
            <Typography>
              For almost two decades, Nashville-based Mother To Mother has been
              working to ensure children in our community have access to three
              basic essentials that often slip through the cracks of government
              subsidies and charitable support:​ diapers car seats a safe place
              to sleep
            </Typography>
          </AccordionDetails>
        </Accordion>

        {showContact && (
          <div className="contact-popup">
            <div className="contact-content">
              <span className="close-btn" onClick={toggleContact}>
                &times;
              </span>
              <h2>Contact Us</h2>
              <h4>Phone</h4>
              <p>615-540-7000</p>
              <h4>Email</h4>
              <p>info@mothertomother.org</p>
              <h4>Address</h4>
              <p>478 Allied Drive Suite 104 & 105</p>
              <p>Nashville, TN 37211</p>
            </div>
          </div>
        )}
      </div>

      <div className="hours-container">
        <div className="hours-section">
          <h2>Warehouse Hours</h2>
          <p>Monday - Thursday: 1:00pm - 4:30pm</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
