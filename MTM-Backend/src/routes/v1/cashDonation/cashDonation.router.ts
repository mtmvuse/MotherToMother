import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as CashDonationService from "../cashDonation/cashDonation.service";
import Joi from "joi";
import type { CashDonationInput } from "../../../types/cashDonation";

const cashDonationRouter = express.Router();

cashDonationRouter.get("/v1", async (req, res, next) => {
  try {
    const cashDonations = await CashDonationService.getCashDonations();
    res.status(200).json(cashDonations);
  } catch (error) {
    next(error);
  }
});

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
