import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { VerifyToken } from './middlewares/VerifyToken';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow cross-origin requests (for frontend to communicate with backend on different ports/address)
app.use(express.json()); // Parses incoming JSON requests and uts the parsed data in req
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with urlenconded payloads

/**
 * Uses the VerifyToken middleware to protect the data route
 * Use the VerifyToken to protect all routes that require authentication
 */
app.use("/data", VerifyToken, require("./routes/dataRoute"));

app.get("/", (req: Request, res: Response) => {
	// Default route: Unprotected
	res.send("Express + Typescript Auth Server Temp!");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
