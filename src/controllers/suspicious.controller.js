import { read } from "../../dal/locationsDal.js";
import { create } from "../../dal/SuspiciousDal.js";

// Function to add a new suspicious point to the database
export async function addNewSuspiciousPoint(req, res) {
  // Extract description, latitude, longitude, and status from request body
  const { description, lat, len, status } = req.body;
  // Validate input, status is optional
  if (!description || !lat || !len) {
    res.status(400).send({ message: "All fields are required" });
    return;
  }
  try {
    // Create a new suspicious point in the database
    const result = await create(description, lat, len, status);
    res
      .status(201)
      .send({ result: result, message: "Suspicious point added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
}

// Function to get all suspicious points from the database
export async function getAllSuspiciousPoints(req, res) {
  try {
    //  Get all suspicious points from the database
    const data = await read("SuspiciousPoints");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
}
