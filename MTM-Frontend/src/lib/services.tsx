import type { EditUserType } from "../types/UserTypes";

export const setUserType = async (uid: string, userType: string) => {
  return await fetch(`api/sessions/v1/setUserType`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, userType }),
  });
};

export const getUserData = async (email: string, token: string | undefined) => {
  return await fetch(`/api/users/v1?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = async (
  email: string,
  userData: EditUserType,
  token: string | undefined,
) => {
  return await fetch(`/api/users/v1/update/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
};
