import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/", getUser);

export default userRoutes;
