import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { ItemInput, ItemInputNoID } from "../../../types/item";
import * as ItemsService from "./item.service";
import Joi from "joi";

const itemsRouter = express.Router();

/**
 * gets an items based upon the {category, name}
 */
itemsRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      category: Joi.string(),
      name: Joi.string(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as ItemInput;
      const users = await ItemsService.getItems(data.category, data.name);
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  },
);

itemsRouter.post(
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
      const data = (await schema.validateAsync(req.body)) as ItemInputNoID;
      const item = await ItemsService.createItem(data);
      return res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

export { itemsRouter };
