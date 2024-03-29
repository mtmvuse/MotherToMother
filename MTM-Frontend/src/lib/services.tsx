import type { UserType } from "../types/AuthTypes";
import type { EditUserType } from "../types/UserTypes";
import type { OutgoingDonationRequestType } from "../types/FormTypes";

const mode = import.meta.env.MODE;
const backendUrl: string =
  mode === "development"
    ? (import.meta.env.VITE_LOCAL_SERVER_URL as string)
    : (import.meta.env.VITE_PRODUCTION_SERVER_URL as string);

export const setUserType = async (uid: string, userType: string) => {
  return await fetch(`${backendUrl}/sessions/v1/setUserType`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, userType }),
  });
};

export const registerUserOnServer = async (user: UserType) => {
  return await fetch(`${backendUrl}/registration/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const getOrganizations = async (query?: string | undefined) => {
  let fetchURL = "";
  if (query === undefined) fetchURL = `${backendUrl}/organization/v1`;
  else fetchURL = `${backendUrl}/organization/v1?type=${query}`;

  const response = await fetch(fetchURL, {
    method: "GET",
    headers: {
      "Control-Cache": "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get organizations: ${response.status}`);
  }
  return await response.json();
};

export const getUserData = async (email: string, token: string | undefined) => {
  return await fetch(`${backendUrl}/users/v1?email=${email}`, {
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
  return await fetch(`${backendUrl}/users/v1/update/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
};

export const getAllItems = async (token: string | undefined) => {
  return await fetch(`${backendUrl}/items/v1/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getItemByCategory = async (
  category: string,
  token: string | undefined,
) => {
  const fullUrl = `${backendUrl}/items/v1/?category=${category}`;

  return await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createOutgoingDonation = async (
  token: string,
  request: OutgoingDonationRequestType,
) => {
  const fullUrl = `${backendUrl}/donation/v1/outgoing/ua`;

  return await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
};
