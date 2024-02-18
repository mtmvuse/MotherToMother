import { db } from "../../../utils/db.server";
import type {
  InventoryType,
  InventoryInputType,
} from "../../../types/inventory";
import type { Prisma } from "@prisma/client";

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
    skip: page * pageSize,
    take: pageSize,
  });
};

/**
 * Get total number of inventory items
 * @returns total number of inventory items
 */
export const getTotalNumberInventory = async (): Promise<number> => {
  return db.item.count();
};

/**
 * Create a item in the inventory table
 * @param item
 * @returns the created item
 */
export const createItem = async (
  item: InventoryInputType,
): Promise<InventoryType> => {
  const createdItem: InventoryType = await db.item.create({
    data: {
      category: item.category,
      name: item.name,
      quantityUsed: item.quantityUsed,
      quantityNew: item.quantityNew,
      valueNew: item.valueNew,
      valueUsed: item.valueUsed,
    },
    select: {
      id: true,
      category: true,
      name: true,
      quantityUsed: true,
      quantityNew: true,
      valueNew: true,
      valueUsed: true,
    },
  });
  return createdItem;
};

export const getItemAP = async (
  page: number,
  pageSize: number,
  whereClause: InventoryInputType,
  orderBy: Prisma.ItemOrderByWithAggregationInput,
): Promise<InventoryType[]> => {
  return db.item.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
  });
};

export const getItemCount = async (
  whereClause: InventoryInputType,
): Promise<number> => {
  return db.item.count({
    where: whereClause,
  });
};
