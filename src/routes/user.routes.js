import { Router } from "express";
import { checkExists } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post('/checkUser', checkExists);

export default userRoutes;
