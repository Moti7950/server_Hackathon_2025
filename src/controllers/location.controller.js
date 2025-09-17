import { read, getOneLocation, create } from "../../dal/locationsDal.js";
import * as turf from "@turf/turf";

// Function to get all locations from the database
export default async function getLocations(req, res) {
  try {
    const result = await read("locations");
    res.status(200).send(result);
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

// Function to get all locations within a certain radius of a given point
export async function getPointsInRadius(req, res) {
  const { lat, len } = req.params;
  console.log(lat, len);
  const searchRadius = 300;
  // Validate input
  if (!lat || !len) {
    return res.status(400).send({ message: "all fields are required" });
  }

  try {
    // Get all locations from the database
    const allLocations = await read("locations");
    // Filter locations within the specified radius
    const centerLat = parseFloat(lat);
    const centerLen = parseFloat(len);
    
     const locationsInRadius = allLocations.filter(location => {
      const distance = calculateDistance(centerLat, centerLen, location.lat, location.len);
      return distance <= searchRadius;
      
    });
    res.status(200).send( locationsInRadius
    );


  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

function calculateDistance(lat1, len1, lat2, len2) {
  const R = 6371000; // רדיוס כדור הארץ במטרים
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLen = (len2 - len1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLen/2) * Math.sin(dLen/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // מרחק במטרים
}
