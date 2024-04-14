import React from "react";
import { Container } from "@mui/material";
import Navbar from "../../components/NavigationBar/BottomNavbar";
import { TopBar } from "../../components/NavigationBar/TopBar";
import { Outlet, useLocation } from "react-router-dom";

export const HomeLayout: React.FC = () => {
  const location = useLocation();
  const isFormRoute = location.pathname.startsWith("/home/form/specificItem");

  return (
    <Container>
      {isFormRoute && <TopBar />}{" "}
      <Container>
        <Outlet />
      </Container>
      <Navbar />
    </Container>
  );
};
