import { UserType } from "~/types/UserTypes";
import { getUserData } from "./services";

export const storeLocalUserType = async (
  userEmail: string,
  accessToken: string,
) => {
  const userResponse = await getUserData(userEmail, accessToken);
  const userData = (await userResponse.json()) as UserType;
  localStorage.setItem("userType", userData.userType);
  return userData.userType;
};
