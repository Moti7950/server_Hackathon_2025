import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", getUser);

export default userRoutes;