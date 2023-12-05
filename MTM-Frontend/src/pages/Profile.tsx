import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import "./Profile.css";
import profile_logo from "../pages/assets/profile_logo.png";

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

  const handleEditProfile = () => {
    navigate("edit");
  };

  return (
    <div className={"profile-container"}>
      <div className={"profile-image"}>
        <img className="profile-logo" src={profile_logo} alt="Image1" />
      </div>
      <div className={"profile-heading"}>
        <div className={"name-container"}>
          <Typography className={"heading"}>{user?.displayName}</Typography>
        </div>
        <Typography className={"subheading"}>
          Organization / Affiliation
        </Typography>
      </div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className={"profile-info"}>
          <div className={"inline"}>
            <strong>Phone:</strong>
            <p className={"value"}>xxx-xxx-xxx</p>
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
      <div className={"buttons-conatiner"}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <button className="edit-button" onClick={handleEditProfile}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Profile;
