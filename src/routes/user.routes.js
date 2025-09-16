import { Router } from "express";
import { checkUser,getAllUsers } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post('/checkUser', checkUser);
userRoutes.get("/", getAllUsers);

export default userRoutes;
