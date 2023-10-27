import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Outlet } from "react-router-dom";
import styles from "./index.module.css";

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
    <div className={styles.page}>
      <Link to="/home/profile">Profile</Link>
      {<Outlet />}
      <p>{fact}</p>
    </div>
  );
};
