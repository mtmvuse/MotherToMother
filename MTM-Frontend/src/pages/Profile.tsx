import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Typography, CircularProgress } from "@mui/material";
import "./Profile.css";
import editButton from "./assets/edit_button.png";

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
    <div className={"profile-container"}>
      <div className={"profile-heading"}>
        <div className={"name-container"}>
          <Typography className={"heading"}>{user?.displayName}</Typography>
          <button>
            <img
              className="name-container-button"
              src={editButton}
              alt="Image1"
            />
          </button>
        </div>
        <Typography className={"subheading"}>
          Organization/ Affiliation
        </Typography>
      </div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className={"profile-info"}>
          <div className={"inline"}>
            <strong>Phone:</strong>
            <p className={"value"}>720-520-3566</p>
          </div>
          <div className={"inline"}>
            <strong>Email:</strong>
            <p className={"value"}>{user?.email}</p>
          </div>
          <div className={"inline"}>
            <strong>Address:</strong>
            <p className={"value wrap"}>
              478 Allied DriveSuite 104 & 105Nashville, TN 37211
            </p>
          </div>
        </div>
      )}
      <div className={"logout"}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
