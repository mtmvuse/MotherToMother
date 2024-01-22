import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  SvgIcon,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DonationIcon from "./DonationIcon";

import homeIcon from "../../pages/assets/home-icon.png";
import profileIcon from "../../pages/assets/profile-icon.png";
import formIcon from "../../pages/assets/form-icon.png";

import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Change breakpoint as needed

  const getParentRoute = (pathname: string) => {
    if (pathname.startsWith("/home/profile")) {
      return "/home/profile";
    } else if (pathname.startsWith("/home/form")) {
      return "/home/form";
    } else {
      return pathname;
    }
  };

  return (
    <div className="BottomNavbar">
      <Box>
        <BottomNavigation
          showLabels
          value={getParentRoute(location.pathname)}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
          sx={{
            "& .MuiBottomNavigationAction-root.Mui-selected": {
              bgcolor: "var(--mtmLightBlue)",
              borderRadius: "15px",
            },
          }}
        >
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home"}
            icon={<img src={homeIcon} />}
          />
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home/profile"}
            icon={<img src={profileIcon} />}
          />
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home/form"}
            icon={<img src={formIcon} />}
          />
        </BottomNavigation>
        {isMobile && <div className="navbar-spacer"></div>}
      </Box>
    </div>
  );
};

export default Navbar;
