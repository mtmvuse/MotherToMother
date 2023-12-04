import { db } from "../../../utils/db.server";
import { Organization } from "../../../types/organization";

/**
 * get all organizations in the db
 * @returns  all organizations in the db
 */
export const getOrganizations = async (): Promise<Organization[]> => {
  return db.organization.findMany({
    select: {
      id: true,
      name: true,
      type: true,
    },
  });
};

/**
 * Get all organizations of the specified type
 * @param type type of organizations to fetch
 * @returns all organizations in the defined type
 */
export const getOrganizationsByType = async (
  type: string,
): Promise<Organization[]> => {
  return db.organization.findMany({
    where: {
      type: type,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const createOrganization = async (
  inputName: string,
  inputType: string,
): Promise<Organization> => {
  return db.organization.create({
    data: { name: inputName, type: inputType },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });
};
