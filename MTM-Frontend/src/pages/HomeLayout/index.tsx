import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Outlet } from "react-router-dom";
import styles from "./index.module.css";
import { Container, Typography, Box } from "@mui/material";

export const HomeLayout: React.FC = () => {
  const [fact, setFact] = useState<string>("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const token = await currentUser?.getIdToken();

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await fetch("/api/example", payloadHeader);
        setFact(await res.text());
      } catch (err) {
        console.log(err);
      }
    };

    void fetchFact();
  }, [currentUser]);

  return (
    <Container
      style={{ display: "flex", flexDirection: "column", minHeight: "95vh" }}
    >
      <Outlet />
      <div style={{ marginTop: "auto" }}>
        <Link to="/home/profile">Profile</Link>
        <Typography variant="body1">{fact}</Typography>
      </div>
    </Container>
  );
};
