import express, {
    type Request,
    type Response,
    type NextFunction,
  } from "express";
import {db} from "../../../utils/db.server"

const donationRouter = express.Router();

const createOutgoingDonation = async (req: Request, res: Response, next: NextFunction) => {
    // Date String to Date Object Conversion
    const {date, ...otherReqBody} = req.body;
    const [month, day, year] = date.split("-");
    const dateNew = new Date();
    dateNew.setFullYear(parseInt(year));
    dateNew.setMonth(parseInt(month) - 1);
    dateNew.setDate(parseInt(day));

    try {
        const newOutgoingDonation = await db.outgoingDonation.create({
            data: {
                date: dateNew,
                ...otherReqBody,
            },
        });
        return res.status(200).json(newOutgoingDonation);
    }
    catch (e) {
        console.log("Error in createOutgoingDonation");
        next(e);
    }
}

donationRouter.post('/createOutgoingDonation', createOutgoingDonation);

export {donationRouter};