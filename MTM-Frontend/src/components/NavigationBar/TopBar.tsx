import React from "react";
import "./Navbar.css";
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

export const TopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="TopBar">
      <Box sx={{ flexGrow: 1, width: 1, maxHeight: "50px" }}>
        <AppBar
          elevation={0}
          color="inherit"
          sx={{ flexDirection: "row" }}
          onClick={() => {
            navigate(-1);
          }}
          position="static"
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            style={{ color: "gray" }}
            sx={{ ml: 1, mr: 2 }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            align="center"
            style={{ color: "#A4A4A4", fontFamily: "Roboto", fontWeight: 400 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            return back
          </Typography>
        </AppBar>
      </Box>
    </div>
  );
};
