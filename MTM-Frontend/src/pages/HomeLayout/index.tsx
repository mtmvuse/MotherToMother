import styles from "./index.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "../../components/NavigationBar/BottomNavbar";
import { TopBar } from "../../components/NavigationBar/TopBar";

export const HomeLayout: React.FC = () => {
  const location = useLocation();
  const isHomeIndex = location.pathname === "/home";

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
