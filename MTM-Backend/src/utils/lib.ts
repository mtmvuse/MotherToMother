/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/** This file is the utils file that ignores type safety for priority purposes.
 * Will be good to add type back in the future */

const isDate = (value: any) => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  return isoDatePattern.test(value);
};
/**
 * Translate the filters to Prisma format
 * @param filters filters for the query
 * @returns where clause for the prisma client
 */
export const translateFilterToPrisma = (filters: any) => {
  const where: any = {};
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (!value) return;

    const [field, operation] = key.split("_");

    switch (operation) {
      case "contains":
        where[field] = { contains: value };
        break;
      case "startsWith":
        where[field] = { startsWith: value };
        break;
      case "endsWith":
        where[field] = { endsWith: value };
        break;
      case "isEmpty":
        where[field] = { equals: "" };
        break;
      case "isNotEmpty":
        where[field] = { not: { equals: "" } };
        break;
      case "not":
        const num = parseFloat(value);
        where[field] = { not: { equals: isNaN(num) ? value : num } };
        break;
      case "gt":
        if (isDate(value)) {
          const startOfNextDay = new Date(value);
          startOfNextDay.setDate(startOfNextDay.getDate() + 1);
          where[field] = {
            gt: startOfNextDay,
          };
        } else {
          where[field] = { gt: Number(value) };
        }
        break;
      case "lt":
        if (isDate(value)) {
          const date = new Date(value);
          where[field] = {
            lt: date,
          };
        } else {
          where[field] = { lt: Number(value) };
        }
        break;
      case "gte":
        if (isDate(value)) {
          const date = new Date(value);
          where[field] = {
            gte: date,
          };
        } else {
          where[field] = { gte: Number(value) };
        }
        break;
      case "lte":
        if (isDate(value)) {
          const startOfNextDay = new Date(value);
          startOfNextDay.setDate(startOfNextDay.getDate() + 1);
          where[field] = {
            lt: startOfNextDay,
          };
        } else {
          where[field] = { lte: Number(value) };
        }
        break;
      default:
        if (isDate(value)) {
          const startOfDay = new Date(value);
          const startOfNextDay = new Date(startOfDay);
          startOfNextDay.setDate(startOfNextDay.getDate() + 1);
          where[field] = {
            gte: startOfDay,
            lt: startOfNextDay,
          };
        } else {
          where[field] = { equals: value };
        }
        break;
    }
  });

  return where;
};

/**
 * Translate the sort and order to Prisma format, assuming only one sort field
 * @param sort sort field
 * @param order order, either asc or desc
 * @returns the orderby clause
 */
export const translateSortToPrisma = (sort: string, order: string) => {
  const orderBy: any = {};
  orderBy[sort] = order;
  return orderBy;
};
