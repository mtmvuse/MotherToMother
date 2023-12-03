import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Box, Grid } from "@mui/material";
import { constructPayloadHeaders } from "../../lib/utils";
import Navbar from "../../components/NavigationBar/BottomNavbar";
import { TopBar } from "../../components/NavigationBar/TopBar";

export const HomeLayout: React.FC = () => {
  const [fact, setFact] = useState<string>("");
  const { currentUser } = useAuth();
  const location = useLocation();
  const isHomeIndex = location.pathname === "/home";

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const token = await currentUser?.getIdToken();
        const res = await fetch(
          "/api/example/",
          constructPayloadHeaders(token),
        );
        setFact(await res.text());
      } catch (err) {
        console.log(err);
      }
    };

    void fetchFact();
  }, [currentUser]);

  return (
    <Container className={styles.container} sx={isHomeIndex ? { px: 0 } : {}}>
      <TopBar />
      <Container className={styles.container} sx={isHomeIndex ? { px: 0 } : {}}>
        <Outlet />
      </Container>
      <Navbar />
    </Container>
  );
};

// font for return click function for return fix top bar
