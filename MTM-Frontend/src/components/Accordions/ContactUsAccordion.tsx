import React from "react";
import Typography from "@mui/material/Typography";

import { Accordion } from "./Accordion";
import { AccordionSummary } from "./AccordionSummary";
import { AccordionDetails } from "./AccordionDetails";
import { Box } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";

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
  const contactUsIcons = [
    LocalPhoneOutlinedIcon,
    EmailOutlinedIcon,
    LinkOutlinedIcon,
  ];
  const AdressIcon = [HomeOutlinedIcon];
  const ClockIcon = [WatchLaterOutlinedIcon];
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
          customStyles={{ backgroundColor: "#FFFFFF" }}
        >
          <Typography className="square-button">CONTACT & HOURS</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#FFFFFF" }}>
          <InfoBox
            title="Contact Us"
            text="615-540-7000 info@mothertomother.org www.mothertomother.org/"
            icons={contactUsIcons}
            marginTop={"39.5px"}
            margin={"2px 10px 14px 14px"}
            marginTopText={"5px"}
          />
          <Box marginTop={"30px"}>
            <InfoBox
              title="Address"
              text={
                <>
                  478 Allied Drive
                  <br />
                  Suite 104 & 105
                  <br />
                  Nashville, TN 37211
                </>
              }
              icons={AdressIcon}
              marginTop={"39.5px"}
              margin={"25px 10px 14px 14px"}
              marginTopText={"5px"}
            />
          </Box>
          <Box marginTop={"30px"}>
            <InfoBox
              title={
                <>
                  Drop Off <br />
                  Hours
                </>
              }
              text={
                <>
                  Mon – Thur 1-4:30 pm
                  <br />
                  Fri - Sun CLOSED"
                </>
              }
              icons={ClockIcon}
              marginTop={"32px"}
              margin={"25px 10px 14px 14px"}
              marginTopText={"15px"}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

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
  fontSize: "20px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0em",
  textAlign: "center",
  color: "#FFFFFF",
  whiteSpace: "nowrap",
} as const;

interface InfoBoxProps {
  title: string;
  text: string;
  icons: ReactElement[];
  marginTop: string;
  margin: string;
  marginTopText: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  icons,
  text,
  marginTop,
  margin,
  marginTopText,
}) => {
  return (
    <Box sx={boxStyle}>
      <Typography sx={innerTextStyle} marginTop={marginTop}>
        {title}
      </Typography>
      <Box sx={innerBoxStyle}>
        <Box sx={{ margin: margin, marginLeft: "8px" }}>
          {icons.map((Icon, index) => (
            <React.Fragment key={index}>
              <Icon fontSize="small" />
              <br />
            </React.Fragment>
          ))}
        </Box>
        <Typography sx={{ marginTop: marginTopText, fontSize: "14px" }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export { ContactUsAccordion };
