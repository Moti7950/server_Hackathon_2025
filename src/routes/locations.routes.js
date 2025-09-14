import getLocations from "../controllers/location.controller.js";
import { Router } from "express";



const locationRoutes = Router();


locationRoutes.get("/", getLocations);

export default locationRoutes;
