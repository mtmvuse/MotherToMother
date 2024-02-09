import type { EditUserType, AddUserType } from "../types/user";
const mode = import.meta.env.MODE;
const backendUrl: string =
  mode === "development"
    ? (import.meta.env.VITE_LOCAL_SERVER_URL as string)
    : (import.meta.env.VITE_PRODUCTION_SERVER_URL as string);

export const getUsers = async (
  token: string | undefined,
  page: number,
  pageSize: number
) => {
  return await fetch(
    `${backendUrl}/users/v1?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateUser = async (
  email: string,
  userData: EditUserType,
  token: string
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

export const addUser = async (user: AddUserType) => {
  return await fetch(`${backendUrl}/registration/v1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
};

export const getOrganizations = async (query?: string | undefined) => {
  const fetchURL = query
    ? `${backendUrl}/organization/v1?type=${query}`
    : `${backendUrl}/organization/v1`;
  return await fetch(fetchURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
