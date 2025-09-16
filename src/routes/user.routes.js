import { Router } from "express";
import { checkUser,getAllUsers } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.post("/login", checkUser);
userRoutes.get("/", getAllUsers);

export default userRoutes;
