/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as CashDonationService from "../cashDonation/cashDonation.service";
import Joi from "joi";
import type {
  APQueryType,
  CashDonationInput,
  cdDashboardDisplay,
} from "../../../types/cashDonation";
import {
  translateFilterToPrisma,
  translateSortToPrisma,
} from "../../../utils/lib";
import { type Prisma } from "@prisma/client";

const cashDonationRouter = express.Router();

cashDonationRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, APQueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const query = req.query;
    const { page, pageSize, sort, order, ...filters } = query;
    const pageInt = Number(page);
    const pageSizeInt = Number(pageSize);
    const typedFilters = {
      ...filters,
      id: filters.id && Number(filters.id),
    };
    const whereClause = translateFilterToPrisma(
      typedFilters,
    ) as cdDashboardDisplay;
    const orderBy = translateSortToPrisma(
      sort,
      order,
    ) as Prisma.cashDonation_dashboardAvgOrderByAggregateInput;
    try {
      let cashDonation;
      if (pageInt == -1 && pageSizeInt == -1) {
        cashDonation = await CashDonationService.getAllCdAP(
          whereClause,
          orderBy,
        );
      } else {
        cashDonation = await CashDonationService.getCdAP(
          pageInt,
          pageSizeInt,
          whereClause,
          orderBy,
        );
      }
      const count = await CashDonationService.getCdCount(whereClause);
      return res.status(200).json({ cashDonation, totalNumber: count });
    } catch (e) {
      next(e);
    }
  },
);

// Route handler for adding a cash donation
cashDonationRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      organizationId: Joi.number().integer().positive(),
      date: Joi.date().iso().required(),
      total: Joi.number().positive().required(),
    });
    try {
      const validatedData = (await schema.validateAsync(
        req.body,
      )) as CashDonationInput;

      const result =
        await CashDonationService.createCashDonation(validatedData);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

cashDonationRouter.put(
  "/v1/update/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      organizationId: Joi.number().integer().positive(),
      date: Joi.date().iso().required(),
      total: Joi.number().positive().required(),
    });
    const id = Number(req.params.id);
    try {
      const cashData = (await schema.validateAsync(
        req.body,
      )) as CashDonationInput;
      const cash = await CashDonationService.updateCashById(cashData, id);
      return res.status(201).json(cash);
    } catch (e) {
      next(e);
    }
  },
);

cashDonationRouter.delete(
  "/v1/delete/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idc = Number(req.params.id);
      await CashDonationService.deleteCashDonation(idc);
      return res.status(204).json(idc);
    } catch (e) {
      next(e);
    }
  },
);

export { cashDonationRouter };
