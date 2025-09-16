import getLocations from "../controllers/location.controller.js";
import {addLocation,checkifexist,addSuspicious} from '../controllers/location.controller.js'

import { Router } from "express";



const locationRoutes = Router();

// This endpoint returns all locations in the database
locationRoutes.get("/", getLocations);

// This endpoint adds a new location to the database

locationRoutes.post('/', addLocation);

// This endpoint checks if a location exists in the database

locationRoutes.get('/:lat/:len', checkifexist);

// This endpoint adds a suspicious point to the database

locationRoutes.post('/SuspiciousPoint', addSuspicious);

export default locationRoutes;
