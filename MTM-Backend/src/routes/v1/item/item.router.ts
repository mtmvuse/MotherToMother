import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { ItemInputNoID, ItemType } from "../../../types/item";
import * as ItemsService from "./item.service";
import Joi from "joi";

const itemsRouter = express.Router();

interface QueryType {
  category: string;
  name: string;
}

/**
 * gets an items based upon the {category, name}
 */
itemsRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const category = req.query.category;
    const name = req.query.name;
    try {
      let items: ItemType[] | null;
      if (!category && !name) {
        items = await ItemsService.getAllItems();
      } else if (category && !name) {
        items = await ItemsService.getItemsCategory(category);
      } else if (!category && name) {
        items = await ItemsService.getItemsName(name);
      } else {
        items = await ItemsService.getItemsCategoryName(category, name);
      }
      return res.status(200).json(items);
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
