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
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  return (
    <div
      className="BottomNavbar"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
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
