import { db } from "../../../utils/db.server";
import type {
  ResponseUser,
  UserInput,
  PasswordCombo,
} from "../../../types/user";
import bcrypt from "bcrypt";

export const hashPassword = async (
  password: string,
): Promise<PasswordCombo> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};

const validatePassword = async (
  userPassword: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(userPassword, hash);
};

/**
 * get all users in the db
 * @returns all users in the database
 */
export const getUsers = async (): Promise<ResponseUser[]> => {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
};

/**
 * Get a user by id
 * @param id
 * @returns a user given id or null if not found
 */
export const getUser = async (id: number): Promise<ResponseUser | null> => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
};

/**
 * Create a user
 * @param user
 * @returns the id and email of the user
 */
export const createUser = async (user: UserInput): Promise<ResponseUser> => {
  const { password, ...userInfo } = user;
  const { hash, salt } = await hashPassword(password);

  return db.user.create({
    data: { ...userInfo, hash: hash, salt: salt },
    select: {
      id: true,
      email: true,
    },
  });
};

export const updateUser = async (
  user: UserInput,
  id: number,
): Promise<ResponseUser> => {
  return db.user.update({
    where: {
      id,
    },
    data: user,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.user.delete({
    where: {
      id,
    },
  });
};
