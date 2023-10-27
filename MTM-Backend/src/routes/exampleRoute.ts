import express, { type Request, type Response } from "express";
const exampleRoute = express.Router();

exampleRoute.get("/", (req: Request, res: Response) => {
  res.send("Server example home page");
});

export { exampleRoute };
