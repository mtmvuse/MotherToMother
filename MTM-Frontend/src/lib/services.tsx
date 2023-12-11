import type { UserType } from "../types/AuthTypes";

export const setUserType = async (uid: string, userType: string) => {
  return await fetch(`api/sessions/v1/setUserType`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, userType }),
  });
};

export const registerUserOnServer = async (user: UserType) => {
  return await fetch(`api/registration/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};
