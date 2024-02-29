import { db } from "../../../utils/db.server";
import type { Report } from "../../../types/report";
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
  whereClause: Report,
  orderBy: Prisma.report_dashboardOrderByWithAggregationInput,
): Promise<Report[] | null> => {
  return db.report_dashboard.findMany({
    where: whereClause,
    take: pageSize,
    skip: page * pageSize,
    orderBy: orderBy,
  });
};

/**
 *  get count of qualified reports in the db for AP
 * @returns count of all users in the database
 */
export const getReportCount = async (whereClause: Report): Promise<number> => {
  return db.report_dashboard.count({
    where: whereClause,
  });
};
