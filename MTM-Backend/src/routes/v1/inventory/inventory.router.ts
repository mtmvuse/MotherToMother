import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import * as ItemService from "./inventory.service";
import type { InventoryInputType } from "../../../types/inventory";
import Joi from "joi";
import {
  translateFilterToPrisma,
  translateSortToPrisma,
} from "../../../utils/lib";
import type { Prisma } from "@prisma/client";

const inventoryRouter = express.Router();

/**
 * get an inventory based upon the {page, pageSize, sort, order, ...filters} query
 * @returns the inventory based on the query
 */
inventoryRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, pageSize, sort, order, ...filters } = req.query;

    const pageInt = Number(page);
    const pageSizeInt = Number(pageSize);
    const typedFilters = {
      ...filters,
      id: filters.id && Number(filters.id),
    };
    const whereClause = translateFilterToPrisma(
      typedFilters,
    ) as InventoryInputType;
    const orderBy = translateSortToPrisma(
      sort as string,
      order as string,
    ) as Prisma.ItemOrderByWithAggregationInput;
    try {
      const inventory = await ItemService.getItemAP(
        pageInt,
        pageSizeInt,
        whereClause,
        orderBy,
      );

      const count = await ItemService.getItemCount(whereClause);
      return res.status(200).json({ inventory, totalNumber: count });
    } catch (e) {
      next(e);
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
      const item = await ItemService.createItem(data);
      return res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

inventoryRouter.delete(
  "/v1/delete/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await ItemService.deleteInventoryById(id);
      return res.status(204).json(id);
    } catch (e) {
      next(e);
    }
  },
);

inventoryRouter.put(
  "/v1/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      category: Joi.string().required(),
      name: Joi.string().required(),
      quantityUsed: Joi.number().required(),
      quantityNew: Joi.number().required(),
      valueNew: Joi.number().required(),
      valueUsed: Joi.number().required(),
    });
    const id = Number(req.params.id);
    try {
      const data = (await schema.validateAsync(req.body)) as InventoryInputType;
      const item = await ItemService.editInventoryById(id, data);
      return res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);
export { inventoryRouter };
