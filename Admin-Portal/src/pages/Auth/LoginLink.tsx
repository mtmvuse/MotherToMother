import React, { useEffect } from "react";
import { useAuth } from "../../lib/contexts";

interface LoginLinkProps {
  email: string | null;
}
const LoginLink: React.FC<LoginLinkProps> = (props) => {
  const email = props.email;
  const { handleLoginWithEmailLink } = useAuth();

  useEffect(() => {
    handleLoginWithEmailLink(email);
    window.close();
  }, []);
  return (
    <>
      <p>Authenticating...</p>
    </>
  );
};
export default LoginLink;
