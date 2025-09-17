import { Router } from "express";
import { addNewSuspiciousPoint, getAllSuspiciousPoints } from "../controllers/suspicious.controller.js";

// Router for suspicious points endpoints
const SuspiciousRouter = Router();

// Endpoint to add a new suspicious point
SuspiciousRouter.post('/',addNewSuspiciousPoint);

// Endpoint to get all suspicious points
SuspiciousRouter.get('/',getAllSuspiciousPoints);



export default SuspiciousRouter;


