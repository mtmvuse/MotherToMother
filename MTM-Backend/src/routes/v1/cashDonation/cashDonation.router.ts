import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as CashDonationService from "../cashDonation/cashDonation.service";
import Joi from "joi";
import type { CashDonationInput } from "../../../types/cashDonation";

const cashDonationRouter = express.Router();

cashDonationRouter.get(
  "/v1",
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const cashDonation = req.query;
    try {
      if (cashDonation == undefined) {
        const cashDonations = await CashDonationService.getCashDonations();
        return res.status(200).json(cashDonations);
      }
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

export { cashDonationRouter };
