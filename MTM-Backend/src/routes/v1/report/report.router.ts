import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as ReportService from "./report.service";
import type { Report } from "../../../types/report";
import {
  translateFilterToPrisma,
  translateSortToPrisma,
} from "../../../utils/lib";
import type { Prisma } from "@prisma/client";

const reportRouter = express.Router();

/**
 * get an report based upon the {page, pageSize, sort, order, ...filters} query
 * @returns the report based on the query
 */
reportRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, sort, order, ...filters } = req.query;
    const pageInt = Number(page);
    const pageSizeInt = Number(pageSize);
    const typedFilters = {
      ...filters,
      id: filters.id && Number(filters.id),
    };
    const whereClause = translateFilterToPrisma(typedFilters) as Report;
    const orderBy = translateSortToPrisma(
      sort as string,
      order as string,
    ) as Prisma.report_dashboardOrderByWithAggregationInput;

    try {
      let report;
      if (pageInt == -1 && pageSizeInt == -1) {
        report = await ReportService.getAllReports(whereClause, orderBy);
      } else {
        report = await ReportService.getReportByPage(
          pageInt,
          pageSizeInt,
          whereClause,
          orderBy,
        );
      }
      const count = await ReportService.getReportCount(whereClause);
      const amount = await ReportService.getReportAmount(whereClause);
      const value = await ReportService.getReportValue(whereClause);
      return res.status(200).json({
        report,
        totalNumber: count,
        totalAmount: amount,
        totalValue: value,
      });
    } catch (e) {
      next(e);
    }
  },
);

export { reportRouter };
