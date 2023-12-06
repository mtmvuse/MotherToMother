import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { UserInput } from "../../../types/user";
import * as UserService from "./user.service";
import Joi from "joi";

const userRouter = express.Router();

interface QueryType {
  email: string;
  organization: string;
}

/**
 * get user based on query parameter supplied
 * if no parameter is supplied return all users
 *
 * if email is supplied return one user with matching email
 *
 * if organization type (donor/agency) is supplied, return a list of users whose
 * organizations have the corresponding organization type
 *
 * if both parameters are supplied return a user whose organization have the
 * corresponding organization type and whose email matches the email queried
 */
userRouter.get(
  "/v1",
  async (
    req: Request<any, any, any, QueryType>,
    res: Response,
    next: NextFunction,
  ) => {
    const email = req.query.email;
    const organizationType = req.query.organization;
    console.log("email: " + email + "\n OrganizationType: " + organizationType);
    try {
      if (email == undefined && organizationType == undefined) {
        const users = await UserService.getUsers();
        return res.status(200).json(users);
      } else if (organizationType == undefined) {
        const user = await UserService.getUserByEmail(email);
        if (user) {
          return res.status(200).json(user);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } else if (email == undefined) {
        const users = await UserService.getUserByOrganization(organizationType);
        return res.status(200).json(users);
      } else {
        const user = await UserService.getUserByOrganizationAndEmail(
          organizationType,
          email,
        );
        if (user) {
          return res.status(200).json(user);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
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
