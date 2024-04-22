import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { UserInput } from "../../../types/user";
import * as UserService from "../user/user.service";
import Joi from "joi";
import { USER_STATUS } from "../../../utils/constants";

const registrationRouter = express.Router();

/**
 * create a user
 */
registrationRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      email: Joi.string().email().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      phone: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zip: Joi.number().integer(),
      role: Joi.string(),
      household: Joi.string(),
      userType: Joi.string(),
      organizationId: Joi.number().integer().positive(),
      status: Joi.string().optional(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as UserInput;
      if (!data.status) {
        data.status = USER_STATUS.ACTIVE;
      }
      const user = await UserService.createUser(data);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

export { registrationRouter };
