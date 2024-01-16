import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/contexts";
import { Box, Button, Typography } from "@mui/material";

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Box>
          <Typography>
            <strong>Name:</strong> {user?.displayName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
