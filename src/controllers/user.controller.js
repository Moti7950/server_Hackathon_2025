import { read } from "../../dal/locationsDal.js";
import { checkUserExist } from "../../dal/usersDal.js";


// Function to check if user exists and validate password
export async function checkUser(req, res) {
  // Extract username and password from request body
  const { username, password } = req.body;
  // Validate input
  if (!username || !password) {
    return res.status(400).send({ message: "Username and password are required" });}
  
  try {
    // Check if user exists in the database
    const result = await checkUserExist("users", username);
    // If password matches, send success response, true + role, else send false
    if (result[0].password === password) {
      return res.status(200).send({status:true,role:result[0].role});
    } else {
        res.status(200).send(false);
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
  

  // Function to get all users from the database

export async function getAllUsers(req, res) {
  try {
    // Get all users from the database
    const result = await read("users");
    res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
