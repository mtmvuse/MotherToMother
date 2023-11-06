import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { UserInput } from "../../../types/user";
import Joi from "joi";
import { auth } from "../../../../config/firebase-config";

const sessionRouter = express.Router();

const setUserType = async (uid: string, userType: string) => {
  return auth
    .setCustomUserClaims(uid, { userType })
    .then(() => {
      console.log(`User type set to ${userType} for user ${uid}`);
    })
    .catch((e) => {
      console.error("Error setting custom claims", e);
      throw e;
    });
};

sessionRouter.put(
  "/v1/setUserType",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uid, userType } = req.body as UserInput;

      await setUserType(uid, userType);

      res.status(200).send("User type updated successfully");
    } catch (error) {
      next(error);
    }
  },
);
export { sessionRouter };
