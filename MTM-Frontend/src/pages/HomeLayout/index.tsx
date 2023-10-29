import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Outlet } from "react-router-dom";
import { Container, Box, Grid } from "@mui/material";
import { constructPayloadHeaders } from "../../lib/utils";

export const HomeLayout: React.FC = () => {
  const [fact, setFact] = useState<string>("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const token = await currentUser?.getIdToken();
        const res = await fetch("/api/example", constructPayloadHeaders(token));
        setFact(await res.text());
      } catch (err) {
        console.log(err);
      }
    };

    void fetchFact();
  }, [currentUser]);

  return (
    <Container className={styles.container}>
      <Container className={styles.content}>
        <Outlet />
      </Container>
      <Container className={styles.navbar}>
        <Grid container style={{ justifyContent: "space-around" }}>
          <Grid item>
            <Link to="/home/profile">Profile</Link>
          </Grid>
          <Grid item>
            <Link to="/home/form">Form</Link>
          </Grid>
          <Grid item>
            <Box>{fact}</Box>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
