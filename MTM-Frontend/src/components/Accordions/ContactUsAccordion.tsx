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
import type { ReactElement } from "react";

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
      >
        <AccordionSummary
          aria-controls="contact-panel-content"
          id="contact-header"
          customStyles={{ backgroundColor: "#F6FBF5" }}
        >
          <Typography className="square-button">CONTACT & HOURS</Typography>
        </AccordionSummary>
        <AccordionDetails customStyles={{ backgroundColor: "#F6FBF5" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography align="justify" width="83%" marginBottom={3}>
              Please refer below for our contact information and drop off hours.
              Please note that donations are accepted during drop off hours
              only. Therefore, we advise that you call ahead to schedule a drop
              off time.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <InfoBox title="Contact Us">
              <>
                <Box sx={innerLineStyle}>
                  <LocalPhoneOutlinedIcon sx={iconStyle} />
                  <Typography variant="caption">615-540-7000</Typography>
                </Box>
                <Box sx={innerLineStyle}>
                  <EmailOutlinedIcon sx={iconStyle} />
                  <Typography variant="caption">
                    info@mothertomother.org
                  </Typography>
                </Box>
                <Box sx={innerLineStyle}>
                  <LinkOutlinedIcon sx={iconStyle} />
                  <Typography variant="caption">
                    www.mothertomother.org
                  </Typography>
                </Box>
              </>
            </InfoBox>
            <InfoBox title="Address">
              <Box sx={innerLineStyle}>
                <HomeOutlinedIcon sx={iconStyle} />
                <Box>
                  <Typography variant="caption">478 Allied Drive</Typography>
                  <br />
                  <Typography variant="caption">Suite 104 & 105</Typography>
                  <br />
                  <Typography variant="caption">Nashville, TN 37211</Typography>
                </Box>
              </Box>
            </InfoBox>
            <InfoBox title="Drop Off Hours">
              <Box sx={innerLineStyle}>
                <WatchLaterOutlinedIcon sx={iconStyle} />
                <Box>
                  <Typography variant="caption">
                    Mon-Thur 9:30am–4:30pm
                  </Typography>
                  <br />
                  <Typography variant="caption">Fri - Sun CLOSED</Typography>
                </Box>
              </Box>
            </InfoBox>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const innerLineStyle = {
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  width: "20px",
  height: "20px",
  marginRight: "10px",
  marginLeft: "10px",
} as const;

interface InfoBoxProps {
  title: string;
  children: ReactElement;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, children }) => {
  return (
    <Box
      sx={{
        width: "90%",
        height: "100%",
        marginBottom: "20px",
        marginTop: "20px",
        backgroundColor: "#4DAD45",
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "20%",
          marginLeft: "29.5px",
          marginRight: "30px",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            lineHeight: "20px",
            letterSpacing: "0em",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "80%",
          height: "100px",
          marginTop: "13.5px",
          marginBottom: "13.5px",
          marginRight: "10px",
          backgroundColor: "#EBF6E9",
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export { ContactUsAccordion };
