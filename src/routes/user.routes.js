import { Router } from "express";
import { checkUserExists } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post('/checkUser', checkUserExists);

export default userRoutes;
