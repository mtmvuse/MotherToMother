import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Button from "@mui/material/Button";

type User = {
  displayName: string | null;
  email: string | null;
};

const Profile: React.FC = () => {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getUser();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleLogout = () => {
    void logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Profile</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {user?.displayName}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
