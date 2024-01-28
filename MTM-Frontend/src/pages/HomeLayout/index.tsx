import React from "react";
import { Container } from "@mui/material";
import Navbar from "../../components/NavigationBar/BottomNavbar";
import { TopBar } from "../../components/NavigationBar/TopBar";
import { Outlet, useLocation } from "react-router-dom";

export interface UserTypeProps {
  savedUserType: string;
}

export const HomeLayout: React.FC<UserTypeProps> = ({ savedUserType }) => {
  const location = useLocation();
  const isFormRoute = location.pathname.startsWith("/home/form/specificItem");

  return (
    <Container>
      {isFormRoute && <TopBar />}{" "}
      <Container>
        <Outlet />
      </Container>
      <Navbar savedUserType={savedUserType} />
    </Container>
  );
};
