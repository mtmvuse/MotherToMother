import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Tab, Tabs, Typography, Button } from "@mui/material";
import { CAPTIONS } from "../lib/constants";
import { useAuth } from "../lib/contexts";
import "./styles/datagrid.css";
import "./styles/sidebar.css";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

interface LinkTabProps {
  label: string;
  href?: string;
  selected?: boolean;
}
const iconMap: { [key: string]: React.ElementType } = {
  donations: VolunteerActivismOutlinedIcon,
  inventory: ContentPasteSearchOutlinedIcon,
  users: GroupOutlinedIcon,
  administration: CorporateFareOutlinedIcon,
  cashdonations: LocalAtmOutlinedIcon,
  reports: AssessmentOutlinedIcon,
};

const LinkTab = ({ label, ...props }: LinkTabProps) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[label.toLowerCase().replace(/\s/g, "")];

  return (
    <Tab
      className="navTab"
      iconPosition="start"
      icon={IconComponent && <IconComponent />}
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(props.href!);
      }}
      aria-current={props.selected && "page"}
      sx={{
        "&.Mui-selected .navTabText": { color: "#1976d2" },
        "&.Mui-selected": { bgcolor: "#e3f2fd" },
      }}
      label={
        <Typography align={"left"} className="navTabText">
          {label}
        </Typography>
      }
      {...props}
    />
  );
};

const HomeLayout: React.FC = () => {
  const location = useLocation();
  const currentPathname = location.pathname.substring(1);
  const captionsToPathnames = CAPTIONS.map((caption) =>
    caption.replace(/\s/g, "").toLowerCase()
  );
  const [curPage, setCurPage] = React.useState(
    captionsToPathnames.indexOf(currentPathname.toLowerCase())
  );
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newPage: number) => {
    setCurPage(newPage);
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className="root-container">
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              flex: "0 0 15%",
              borderRight: 1,
              borderColor: "divider",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tabs
              value={curPage}
              onChange={handleChange}
              aria-label="nav tabs"
              role="navigation"
              orientation="vertical"
              className="tabsContainer"
            >
              {CAPTIONS.map((caption, index) => (
                <LinkTab
                  key={index}
                  label={caption}
                  href={`/${caption.replace(/\s/g, "")}`}
                />
              ))}
            </Tabs>
            <Button sx={{ marginButton: "auto" }} onClick={handleLogout}>
              Logout
            </Button>
            <Box className="appInfoContainer">
              <Typography className="appNameText">Mother to Mother</Typography>
              <Typography className="versionText">Version 1.0.0</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, p: 3 }} className="page-container">
            <Typography variant="h5" className="page-title">
              {CAPTIONS[curPage]}
            </Typography>
            {<Outlet />}
          </Box>
        </Box>
      </Box>
    </StyledEngineProvider>
  );
};

export default HomeLayout;
