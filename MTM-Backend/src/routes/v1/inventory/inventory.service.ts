import { db } from "../../../utils/db.server";
import type {
  InventoryType,
  InventoryInputType,
} from "../../../types/inventory";

/**
 * delete an inventory by its id
 * @param id id of the inventory to be deleted
 */
export const deleteInventoryById = async (id: number): Promise<void> => {
  try {
    await db.item.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const editInventoryById = async (
  id: number,
  item: InventoryInputType,
): Promise<InventoryType> => {
  try {
    const editResult = await db.item.update({
      where: {
        id: id,
      },
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
    return editResult;
  } catch (e) {
    throw e;
  }
};

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
