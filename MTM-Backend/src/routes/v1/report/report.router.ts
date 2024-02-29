import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getReportByPage } from "./report.service";
import type { ReportType } from "../../../types/report";
import Joi from "joi";
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

    const whereClause = translateFilterToPrisma(typedFilters) as ReportType;
    const orderBy = translateSortToPrisma(
      sort as string,
      order as string,
    ) as Prisma.ItemOrderByWithAggregationInput;
    try {
      const report = await getReportByPage(
        pageInt,
        pageSizeInt,
        // whereClause,
        // orderBy,
      );
      // const count = await ItemService.getItemCount(whereClause);
      return res.status(200).json({ report, totalNumber: 1 });
    } catch (e) {
      next(e);
    }
  },
);

export { reportRouter };
