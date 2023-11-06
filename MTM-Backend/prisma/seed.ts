/**
 * feed the database with test data for development
 */
import type { UserInput } from "../src/types/user";
import { hashPassword } from "../src/routes/v1/user/user.service";
import { db } from "../src/utils/db.server";
const getUsers = (): Array<UserInput> => {
  return [
    {
      uid: "123456789",
      firstName: "Sam",
      lastName: "Pope",
      email: "sap@gmail.com",
      password: "123owidc!jJ5",
      userType: "donor",
    },
    {
      uid: "987654321",
      firstName: "John",
      lastName: "Doe",
      email: "jod@gmail.com",
      password: "123owidc!jJ8",
      userType: "requester",
    },
  ];
};

const seed = async () => {
  const users = getUsers();
  for (const user of users) {
    const { password, uid, ...userInfo } = user;
    const { hash, salt } = await hashPassword(password);
    await db.user.create({ data: { ...userInfo, hash: hash, salt: salt } });
  }
};

seed();
