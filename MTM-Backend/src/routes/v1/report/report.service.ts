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
 * query all report data for admin portal on the customized view
 * @param whereClause where clause based on filters
 * @param orderBy orderby based on sort
 * @returns list of reports based on the filters and sort
 */
export const getAllReports = async (
  whereClause: Report,
  orderBy: Prisma.report_dashboardOrderByWithAggregationInput,
): Promise<Report[]> => {
  return db.report_dashboard.findMany({
    where: whereClause,
    orderBy: orderBy,
  });
};

/**
 *  get count of qualified reports in the db for AP
 * @returns count of report based on filter
 */
export const getReportCount = async (whereClause: Report): Promise<number> => {
  return db.report_dashboard.count({
    where: whereClause,
  });
};

/**
 *  get amount of qualified reports in the db for AP
 * @returns count of amount based on filter
 */
export const getReportQuantity = async (
  whereClause: Report,
): Promise<number> => {
  const aggregations = await db.report_dashboard.aggregate({
    _sum: {
      quantity: true,
    },
    where: whereClause,
  });

  return aggregations._sum.quantity || 0;
};

/**
 *  get value of qualified reports in the db for AP
 * @returns count of value based on filter
 */
export const getReportValue = async (whereClause: Report): Promise<number> => {
  const aggregations = await db.report_dashboard.aggregate({
    _sum: {
      total: true,
    },
    where: whereClause,
  });

  return aggregations._sum.total || 0;
};
