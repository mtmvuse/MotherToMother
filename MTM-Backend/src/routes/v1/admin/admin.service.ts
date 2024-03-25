import { db } from "../../../utils/db.server";
import type { AdminInputNoID, AdminType } from "../../../types/admin";

/**
 * get all admins
 * @param page the page number
 * @param pageSize the number of items per page
 * @returns all admins in the database
 */
export const getAllAdmins = async (
  page: number,
  pageSize: number,
): Promise<AdminType[]> => {
  return db.admin.findMany({
    skip: page * pageSize,
    take: pageSize,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

/**
 * get the count of admins
 */
export const getAdminCount = async (): Promise<number> => {
  return db.admin.count();
};
/**
 * Gets all of the admin based on an email
 * @param email the email of the admin (string)
 * @returns an admin in the database or null if the admin does not exist.
 * @throws an error if the admin is not found
 */
export const getAdminEmail = async (
  email: string,
): Promise<AdminType | null> => {
  const admin: AdminType | null = await db.admin.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (admin) {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }

  return null;
};

export const createAdmin = async (
  admin: AdminInputNoID,
): Promise<AdminType | null> => {
  // if email is already in use, throw an error
  const existingAdmin = await db.admin.findUnique({
    where: {
      email: admin.email,
    },
  });
  if (existingAdmin) {
    return null;
  }

  const newAdmin: AdminType = await db.admin.create({
    data: {
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });

  return {
    id: newAdmin.id,
    name: newAdmin.name,
    email: newAdmin.email,
    role: newAdmin.role,
  };
};

export const updateAdmin = async (admin: AdminInputNoID, id: number) => {
  await db.admin.update({
    where: {
      id: id,
    },
    data: {
      name: admin.name,
      role: admin.role,
      email: admin.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const deleteAdmin = async (id: number): Promise<void> => {
  await db.admin.delete({
    where: {
      id,
    },
  });
};
