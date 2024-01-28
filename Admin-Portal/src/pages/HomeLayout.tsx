import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Tab, Tabs, Typography, Button } from "@mui/material";
import { CAPTIONS } from "../lib/constants";
import { useAuth } from "../lib/contexts";

interface LinkTabProps {
  label?: string;
  href?: string;
  selected?: boolean;
}
const LinkTab = (props: LinkTabProps) => {
  const navigate = useNavigate();
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(props.href!);
      }}
      aria-current={props.selected && "page"}
      {...props}
    />
  );
};

const HomeLayout: React.FC = () => {
  const location = useLocation();
  const currentPathname = location.pathname.substring(1);
  const [curPage, setCurPage] = React.useState(
    CAPTIONS.indexOf(currentPathname)
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
      </Box>
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: "25px" }}>
          {CAPTIONS[curPage]}
        </Typography>
        {<Outlet />}
      </Box>
    </Box>
  );
};

export default HomeLayout;
