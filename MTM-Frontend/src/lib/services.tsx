export const setUserType = async (uid: string, userType: string) => {
  return await fetch(`api/sessions/v1/setUserType`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, userType }),
  });
};

export const getUserData = async (email: string) => {
  try {
    const response = await fetch(
      `/api/users/v1?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    throw new Error(`Error fetching user data: ${error}`);
  }
};

export const updateUser = async (email: string, userData: any) => {
  try {
    const response = await fetch(`/api/users/v1/update/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save user data: ${response.status}`);
    }

    return response;
  } catch (error) {
    throw new Error(`Error updating user data: ${error}`);
  }
};
