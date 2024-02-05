import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { getInventoryByPage, createItem } from "./inventory.service";
import type { InventoryInputType } from "../../../types/inventory";
import Joi from "joi";

const inventoryRouter = express.Router();

/**
 * get an inventory based upon the {page, pageSize}
 */
inventoryRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.query.page || !req.query.pageSize) {
        throw new Error("Missing page or pageSize query parameter");
      }

      const page = parseInt(req.query.page as string);
      const pageSize = parseInt(req.query.pageSize as string);

      const inventory = await getInventoryByPage(page, pageSize);

      res.status(200).json(inventory);
    } catch (error) {
      next(error);
    }
  },
);

inventoryRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      category: Joi.string().required(),
      name: Joi.string().required(),
      quantityUsed: Joi.number().required(),
      quantityNew: Joi.number().required(),
      valueNew: Joi.number().required(),
      valueUsed: Joi.number().required(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as InventoryInputType;
      const item = await createItem(data);
      return res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

export { inventoryRouter };
