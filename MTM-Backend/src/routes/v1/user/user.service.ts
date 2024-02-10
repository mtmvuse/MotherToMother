import { db } from "../../../utils/db.server";
import type {
  ResponseUser,
  UserInput,
  PasswordCombo,
} from "../../../types/user";
import bcrypt from "bcrypt";
import type { UserDashboardDisplay } from "../../../types/user";
import type { Prisma } from "@prisma/client";

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
      userType: true,
      firstName: true,
      lastName: true,
      phone: true,
      address: true,
      city: true,
      zip: true,
      state: true,
      Organization: {
        select: {
          name: true,
        },
      },
    },
  });
};

/**
 *  get count of qualified users in the db for AP
 * @returns count of all users in the database
 */
export const getUserCount = async (
  whereClause: UserDashboardDisplay,
): Promise<number> => {
  return db.user_dashboard.count({
    where: whereClause,
  });
};

/**
 * query user data for admin portal on the customized view
 * @param page current page number
 * @param pageSize current page size
 * @param whereClause where clause based on filters
 * @param orderBy orderby based on sort
 * @returns list of users based on the filters and sort
 */
export const getUsersAP = async (
  page: number,
  pageSize: number,
  whereClause: UserDashboardDisplay,
  orderBy: Prisma.user_dashboardAvgOrderByAggregateInput,
): Promise<UserDashboardDisplay[]> => {
  return db.user_dashboard.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
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
      userType: true,
    },
  });
};

/**
 * Get a user by email
 * @param email
 * @returns a user given id or null if not found
 */
export const getUserByEmail = async (
  userEmail: string,
): Promise<ResponseUser | null> => {
  return db.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
      email: true,
      userType: true,
      phone: true,
      address: true,
      city: true,
      zip: true,
      firstName: true,
      lastName: true,
    },
  });
};

/**
 * Get a list of user by organization type
 * @param email
 * @returns a user given id or null if not found
 */
export const getUserByOrganization = async (
  organizationType: string,
): Promise<ResponseUser[] | null> => {
  return db.user.findMany({
    where: {
      Organization: {
        type: organizationType,
      },
    },
    select: {
      id: true,
      email: true,
      userType: true,
    },
  });
};

/**
 * Get a user by organization type and email
 * @param email
 * @returns a user given id or null if not found
 */
export const getUserByOrganizationAndEmail = async (
  organizationType: string,
  userEmail: string,
): Promise<ResponseUser | null> => {
  return db.user.findUnique({
    where: {
      Organization: {
        type: organizationType,
      },
      email: userEmail,
    },
    select: {
      id: true,
      email: true,
      userType: true,
    },
  });
};

/**
 * Create a user
 * @param user
 * @returns the id and email of the user
 */
export const createUser = async (user: UserInput): Promise<ResponseUser> => {
  const { password, uid, ...userInfo } = user;
  const { hash, salt } = await hashPassword(password);

  return db.user.create({
    data: { ...userInfo, hash: hash, salt: salt },
    select: {
      id: true,
      email: true,
      userType: true,
    },
  });
};

/**
 * Update any user information that is new
 * @param user
 * @param id
 * @returns the id and email of the user
 */
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
      userType: true,
    },
  });
};

/**
 * Update any user information that is new
 * @param user
 * @param email
 * @returns the id and email of the user
 */
export const updateUserByEmail = async (
  user: UserInput,
  email: string,
): Promise<ResponseUser> => {
  return db.user.update({
    where: {
      email: email,
    },
    data: user,
    select: {
      id: true,
      email: true,
      userType: true,
    },
  });
};

/**
 * Update user password
 * @param user
 * @returns the id and email of the user
 */
export const resetPassword = async (user: UserInput): Promise<ResponseUser> => {
  const { hash, salt } = await hashPassword(user.password);
  const email = user.email;
  const result = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  return db.user.update({
    where: {
      id: result?.id,
    },
    data: { hash: hash, salt: salt },
    select: {
      id: true,
      email: true,
      userType: true,
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
