import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Typography, CircularProgress, Button, Box } from "@mui/material";

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
    navigate("/");
  };

  return (
    <div>
      <Typography variant="h3">Profile</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography>
            <strong>Name:</strong> {user?.displayName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Profile;
