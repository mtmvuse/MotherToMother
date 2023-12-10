import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import "./Profile.css";
import profile_logo from "../../pages/assets/profile_logo.png";
import { getUserData } from "../../lib/services";
import type { UserType } from "../../types/UserTypes";
import { ErrorMessage } from "../../components/Error";

const Profile: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser) {
          throw new Error("Current user not found");
        }
        const token = await currentUser.getIdToken();

        const userEmail = currentUser.email;
        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await getUserData(userEmail, token);
        if (!response.ok) {
          throw new Error("Error fetching user");
        }

        const userData = (await response.json()) as UserType;
        setUser(userData);
      } catch (error: any) {
        setError(error.message as string);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    void logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("edit");
  };

  return (
    <div className={"profile-container"}>
      <ErrorMessage error={error} setError={setError} />
      <div className={"profile-image"}>
        <img className="profile-logo" src={profile_logo} alt="Image1" />
      </div>
      <div className={"profile-heading"}>
        <div className={"name-container"}>
          <Typography className={"heading"}>{user?.firstName}</Typography>
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
            <p className={"value"}>{user?.phone}</p>
          </div>
          <div className={"inline"}>
            <strong>Email:</strong>
            <p className={"value"}>{user?.email}</p>
          </div>
          <div className={"inline"}>
            <strong>Address:</strong>
            <p className={"value wrap"}>{user?.address}</p>
          </div>
          <div className={"inline"}>
            <strong>Account Type:</strong>
            <p className={"value"}>{user?.userType}</p>
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
