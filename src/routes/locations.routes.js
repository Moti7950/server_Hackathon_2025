import getLocations, { checkArea ,getPointsInRadius} from "../controllers/location.controller.js";
import {
  addLocation,
  checkIfExist,
} from "../controllers/location.controller.js";

import { Router } from "express";

const locationRoutes = Router();

// this endpont bringes all locations in databas
locationRoutes.get("/", getLocations);

// this endpoint add a new location to the database

locationRoutes.post("/", addLocation);

// This endpoint checks if any locations exist inside a given polygon
// The polygon should be sent in the request body in GeoJSON format
locationRoutes.post("/area", checkArea);

locationRoutes.get("/zeek/radius/:lat/:len", getPointsInRadius);

// this endpoint check if the location exist in the database

locationRoutes.get("/:lat/:len", checkIfExist);

export default locationRoutes;
