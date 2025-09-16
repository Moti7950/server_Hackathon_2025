import { read, getOneLocation, create } from "../../dal/locationsDal.js";

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
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
