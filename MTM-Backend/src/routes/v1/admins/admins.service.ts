import { db } from "../../../utils/db.server";
import type { AdminType } from "../../../types/admin";
import { Admin } from "@prisma/client";

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

/*

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
*/
