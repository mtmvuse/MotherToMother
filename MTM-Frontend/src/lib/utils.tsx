import { type UserType, type EditUserType } from "~/types/UserTypes";
import { getUserData } from "./services";

export const storeLocalUserData = async (
  userEmail: string,
  accessToken: string,
) => {
  const userResponse = await getUserData(userEmail, accessToken);
  const userData = (await userResponse.json()) as UserType;
  localStorage.setItem("userType", userData.userType);
  localStorage.setItem("userEmail", userData.email);
  localStorage.setItem("userFirstName", userData.firstName);
};

export const updateLocalUserData = (user: EditUserType) => {
  user.email && localStorage.setItem("userEmail", user.email);
  user.firstName && localStorage.setItem("userFirstName", user.firstName);
};

export const removeLocalUserData = () => {
  localStorage.removeItem("userType");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userFirstName");
  localStorage.removeItem("userId");
};
