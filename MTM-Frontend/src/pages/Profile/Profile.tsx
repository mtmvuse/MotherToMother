import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Typography } from "@mui/material";
import "./Profile.css";
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
          throw new Error("Not loggined in");
        }
        const token = await currentUser.getIdToken();

        const userEmail = currentUser.email;
        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await getUserData(userEmail, token);
        if (!response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const message = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new Error(message.message);
        }

        const userData = (await response.json()) as UserType;
        setUser(userData);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
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
    <div className="profile-page">
      <div className={"logout-button-conatiner"}>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={"profile-container"}>
        <ErrorMessage error={error} setError={setError} />
        <div className={"profile-heading"}>
          <div className={"name-container"}>
            <Typography className={"heading"}>{user?.firstName}</Typography>
          </div>
          <Typography className={"subheading"}>{user?.userType}</Typography>
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
              <p className={"value"}>{user?.address}</p>
            </div>
            <div className={"inline"}>
              <strong>Account Type:</strong>
              <p className={"value"}>{user?.userType}</p>
            </div>
          </div>
        )}
      </div>
      <div className={"edit-button-conatiner"}>
        <button className="edit-button" onClick={handleEditProfile}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Profile;
