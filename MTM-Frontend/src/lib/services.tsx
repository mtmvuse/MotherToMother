import type { UserType, Organization } from "../types/AuthTypes";
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

export const registerUserOnServer = async (user: UserType) => {
  return await fetch(`api/registration/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const getOrganizations = async (
  setError: React.Dispatch<React.SetStateAction<string>>,
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
) => {
  try {
    const response = await fetch(`api/organization/v1`, {
      method: "GET",
      headers: {
        "Control-Cache": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get organizations: ${response.status}`);
    }
    const organizations = await response.json();
    setOrganizations(organizations);
  } catch (err: any) {
    if (err instanceof TypeError) {
      setError("Network error: Failed to get organizations");
    } else {
      setError(err.message);
    }
  }
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
