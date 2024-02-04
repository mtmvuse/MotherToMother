import { db } from "../../../utils/db.server";
import type { InventoryType } from "../../../types/inventory";

/**
 * Get inventory by page
 * @param page page number starting from 1
 * @param pageSize number of items per page
 * @returns extracted list of inventory items from the database
 */
export const getInventoryByPage = async (
  page: number,
  pageSize: number,
): Promise<InventoryType[]> => {
  return db.item.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
};
