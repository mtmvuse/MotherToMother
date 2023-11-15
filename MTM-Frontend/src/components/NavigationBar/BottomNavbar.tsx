import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  SvgIcon,
} from "@mui/material";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DonationIcon from "./DonationIcon";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="BottomNavbar">
      <Box>
        <BottomNavigation
          showLabels
          value={location.pathname}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
          sx={{
            "& .Mui-selected": {
              bgcolor: "#F5F5F5",
              "& .MuiSvgIcon-root": { color: "black" },
            },
          }}
        >
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home"}
            icon={<HomeOutlinedIcon />}
          />
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home/profile"}
            icon={<PersonOutlineOutlinedIcon />}
          />
          <BottomNavigationAction
            sx={{ flexGrow: 1 }}
            value={"/home/form"}
            icon={
              <SvgIcon
                sx={{ bgcolor: "#F5F5F5", alignItems: "center" }}
                component={DonationIcon}
                inheritViewBox
              />
            }
          />
        </BottomNavigation>
      </Box>
    </div>
  );
};

export default Navbar;
