import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/contexts";

const LoginLink: React.FC = () => {
  const { loginWithEmailLink, authError } = useAuth();
  const [loginStatus, setLogInStatus] = useState("Authenticating...");

  useEffect(() => {
    const login = async () => {
      const res = await loginWithEmailLink();
      if (!res) {
        setLogInStatus(
          authError ?? "Error authenticating. Please try again later. "
        );
        return;
      }
      setLogInStatus("Login success! Please close the window.");
    };
    login();
  }, []);
  return (
    <>
      <p>{loginStatus}</p>
    </>
  );
};
export default LoginLink;
