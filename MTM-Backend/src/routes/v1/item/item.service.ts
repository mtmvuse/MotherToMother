import { db } from "../../../utils/db.server";
import type { ItemInputNoID, ItemType } from "../../../types/item";

/**
 * Get a items by id
 * @param category
 * @param name
 * @returns an array of items based upon the given category and name or null if not found
 * will return all the items if category and name if null
 */
export const getItems = async (
  category: string,
  name: string,
): Promise<ItemType[] | null> => {
  let items: ItemType[] | null;

  if (!category && !name) {
    items = await db.item.findMany({
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
  } else if (!category && name) {
    items = await db.item.findMany({
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
  } else if (category && !name) {
    items = await db.item.findMany({
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
  } else {
    items = await db.item.findMany({
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
  }
  return items;
};

/**
 * Create a item
 * @param item
 * @returns the created item
 */
export const createItem = async (item: ItemInputNoID): Promise<ItemType> => {
  const createdItem: ItemType = await db.item.create({
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
