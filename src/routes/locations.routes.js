import getLocations from "../controllers/location.controller.js";
import {addLocation,checkIfExist} from '../controllers/location.controller.js'

import { Router } from "express";



const locationRoutes = Router();

// this endpont bringes all locations in databas 
locationRoutes.get("/", getLocations);

// this endpoint add a new location to the database

locationRoutes.post('/', addLocation);

// this endpoint check if the location exist in the database

locationRoutes.get('/:lat/:len', checkIfExist)


export default locationRoutes;
