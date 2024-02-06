import { db } from "../../../utils/db.server";
import type { ItemType } from "../../../types/item";

/**
 * Gets all items
 * @returns an array of items in the database
 */
export const getAllItems = async (): Promise<ItemType[] | null> => {
  const items: ItemType[] | null = await db.item.findMany({
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

  return items;
};

/**
 * Get a items by category
 * @param category
 * @returns an array of items based upon the given category
 */
export const getItemsCategory = async (
  category: string,
): Promise<ItemType[] | null> => {
  const items: ItemType[] | null = await db.item.findMany({
    where: {
      category: category,
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

  return items;
};

/**
 * Get a items by id w/valid Category and Name
 * @param category
 * @param name
 * @returns an array of items based upon the given category and name
 */
export const getItemsName = async (
  name: string,
): Promise<ItemType[] | null> => {
  const items: ItemType[] | null = await db.item.findMany({
    where: {
      name: name,
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

  return items;
};

/**
 * Get a items by category and Name
 * @param category
 * @param name
 * @returns an array of items based upon the given category and name
 */
export const getItemsCategoryName = async (
  category: string,
  name: string,
): Promise<ItemType[] | null> => {
  const items: ItemType[] | null = await db.item.findMany({
    where: {
      category: category,
      name: name,
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

  return items;
};
