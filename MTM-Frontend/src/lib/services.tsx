export const setUserType = async (uid: string, userType: string) => {
  return await fetch(`api/sessions/v1/setUserType`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, userType }),
  });
};
