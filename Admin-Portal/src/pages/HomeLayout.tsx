import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";

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
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          flex: "0 0 20%",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs"
          role="navigation"
          orientation="vertical"
        >
          <LinkTab label="Profile" href="/" />
          <LinkTab label="Page 1" href="/page1" />
          <LinkTab label="Page 2" href="/page2" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, p: 3 }}>{<Outlet />}</Box>
    </Box>
  );
};

export default HomeLayout;
