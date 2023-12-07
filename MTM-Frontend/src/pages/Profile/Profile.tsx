import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import "./Profile.css";
import profile_logo from "../../pages/assets/profile_logo.png";

type User = {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  userType: string | null;
};

const Profile: React.FC = () => {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = getUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = getUser();
        if (currentUser) {
          const userEmail = currentUser.email;

          const response = await fetch(
            `http://localhost:3001/users/v1?email=${userEmail}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            },
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsLoading(false);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          throw new Error("Current user not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [getUser]);

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
