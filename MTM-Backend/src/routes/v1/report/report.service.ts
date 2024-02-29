import { db } from "../../../utils/db.server";
import type { ReportResponse } from "../../../types/report";
import type { Prisma } from "@prisma/client";

/**
 * Get report by page with related data
 * @param page page number starting from 1
 * @param pageSize number of items per page
 * @returns extracted list of reports
 */
export const getReportByPage = async (
  page: number,
  pageSize: number,
  // whereClause: ReportType,
  // orderBy: Prisma.ItemOrderByWithAggregationInput,
): Promise<ReportResponse | null> => {
  return db.report_dashboard.findMany({
    // where: whereClause,
    // orderBy: orderBy,
    // take: pageSize,
    // skip: page,
  });
};

/**
 * Get total number of inventory items
 * @returns total number of inventory items
 */
export const getTotalNumberInventory = async (): Promise<number> => {
  return db.item.count();
};
