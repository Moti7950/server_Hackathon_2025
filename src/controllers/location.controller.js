import { read, getOneLocation, create } from "../../dal/locationsDal.js";
import * as turf from "@turf/turf";

// Function to get all locations from the database
export default async function getLocations(req, res) {
  try {
    const result = await read("locations");
    res.status(200).send(await result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

// Function to add a new location to the database
export async function addLocation(req, res) {
  // Extract location details from request body
  const { lat, len, description, type } = req.body;
  // Validate input
  if (!lat || !len || !description || !type) {
    return res.status(400).send({ message: "all fields are required" });
  }
  try {
    //  Add new location to the database
    const result = await create("locations", description, type, lat, len);
    res.status(201).send(`location added: ${await result}`);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

// Function to check if a location exists in the database
export async function checkIfExist(req, res) {
  // Extract latitude and longitude from request parameters
  const { lat, len } = req.params;
  // Validate input
  if (!lat || !len) {
    return res.status(400).send({ message: "all fields are required" });
  }
  try {
    // Check if location exists in the database
    const result = await getOneLocation("locations", lat, len);
    if (result.length === 0) {
      return res.status(200).send(false);
    }
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

// Function to check if any locations exist inside a given polygon
export async function checkArea(req, res) {
  // Extract polygon GeoJSON from request body
  // The polygon should be in GeoJSON format, e.g. { "type": "Polygon", "coordinates": [...] }
  const polygonGeoJSON = req.body;

  // Validate input
  if (!polygonGeoJSON) {
    return res.status(400).send({ message: "Polygon is required" });
  }

  try {
    // Get all locations from the database
    const locations = await read("locations");

    // Filter locations that are inside the polygon
    const matched = locations.filter((loc) => {
      const point = turf.point([loc.len, loc.lat]);
      return turf.booleanPointInPolygon(point, polygonGeoJSON);
    });

    // Return matched locations
    res.status(200).json(matched);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
}
