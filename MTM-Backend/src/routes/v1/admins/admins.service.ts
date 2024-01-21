import { db } from "../../../utils/db.server";
import type { AdminInputNoID, AdminType } from "../../../types/admin";

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
): Promise<AdminType> => {
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

export const updateAdmin = async (admin: AdminInputNoID) => {
  await db.admin.update({
    where: {
      email: admin.email,
    },
    data: {
      name: admin.name,
      role: admin.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
