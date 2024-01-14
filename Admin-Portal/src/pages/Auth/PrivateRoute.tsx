import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/contexts";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
