/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/** This file is the utils file that ignores type safety for priority purposes.
 * Will be good to add type back in the future */

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
    if (field === "date") return;

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
        where[field] = { gt: Number(value) };
        break;
      case "lt":
        where[field] = { lt: Number(value) };
        break;
      case "gte":
        where[field] = { gte: Number(value) };
        break;
      case "lte":
        where[field] = { lte: Number(value) };
        break;
      case "equals":
        where[field] = { equals: Number(value) };
        break;
      default:
        where[field] = { equals: value };
        break;
    }
  });

  // Need to handle date seperately as gte and lte required by DateRange
  if (filters["date_lte"] || filters["date_gte"]) {
    where["date"] = {
      lte: filters?.date_lte,
      gte: filters?.date_gte,
    };
  }

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
