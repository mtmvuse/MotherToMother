import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { UserInput } from "../../../types/user";
import * as UserService from "./user.service";
import Joi from "joi";

const userRouter = express.Router();

/**
 * get all users in the database
 */
userRouter.get(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getUsers();
      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  },
);

/**
 * get a user by email
 */
userRouter.get(
  "/v1/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.email;
    try {
      const user = await UserService.getUserByEmail(email);
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Reset user Password
 */
userRouter.put(
  "/v1/forgetPassword/",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as UserInput;
      const user = await UserService.resetPassword(data);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Update User
 */
userRouter.put(
  "/v1/update/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      organizationId: Joi.number(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zip: Joi.number().integer().positive(),
      role: Joi.string(),
      household: Joi.string(),
      userType: Joi.string(),
    });
    const userEmail = req.params.email;
    try {
      const data = (await schema.validateAsync(req.body)) as UserInput;
      const user = await UserService.updateUserByEmail(data, userEmail);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

export { userRouter };
