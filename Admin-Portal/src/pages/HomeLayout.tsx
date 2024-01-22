import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { CAPTIONS } from "../lib/constants";

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
  const [curPage, setCurPage] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newPage: number) => {
    setCurPage(newPage);
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
      </Box>
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {CAPTIONS[curPage]}
        </Typography>
        {<Outlet />}
      </Box>
    </Box>
  );
};

export default HomeLayout;
