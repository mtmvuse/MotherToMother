import React from "react";
import { Container } from "@mui/material";
import Navbar from "../../components/NavigationBar/BottomNavbar";
import { TopBar } from "../../components/NavigationBar/TopBar";
import { getUserData } from "../../lib/services";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, useLocation } from "react-router-dom";

export const HomeLayout: React.FC = () => {
  const location = useLocation();
  const isFormRoute = location.pathname.startsWith("/home/form/specificItem");
  const isHomeIndex = location.pathname === "/home";
  const { currentUser } = useAuth();

  const storeUserType = async () => {
    try {
      const token = await currentUser?.getIdToken();
      if (!currentUser) {
        throw new Error("Failed to fetch user data");
      }
      const userEmail = currentUser.email;
      if (!userEmail) {
        throw new Error("User email not found");
      }
      const response = await getUserData(userEmail, token);
      if (!response.ok) {
        throw new Error("Error fetching user");
      }
      const userData = await response.json();
      localStorage.setItem("userType", userData.userType);
      // console.log(localStorage.getItem("userType"));
    } catch (error: any) {
      console.error("Error fetching user:", error);
    }
  };

  if (localStorage.getItem("userType") == null) {
    storeUserType();
  }

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
