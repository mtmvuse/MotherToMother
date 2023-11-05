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
 * get a user by id
 */
userRouter.get(
  "/v1/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    try {
      const user = await UserService.getUser(id);
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
 * create a user
 */
userRouter.post(
  "/v1",
  async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      password: Joi.string().min(8).required(),
      email: Joi.string().email().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    });
    try {
      const data = (await schema.validateAsync(req.body)) as UserInput;
      const user = await UserService.createUser(data);
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

export { userRouter };
