import styles from "./index.module.css";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.inputsContainer}>
          <div className={styles.inputsWrapper}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
