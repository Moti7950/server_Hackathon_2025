import supabaseDb from "../lib/supabase.js";
// Define the connection to the database
const conn = await supabaseDb();
//  Define the collection name
const collection = "SuspiciousPoints";


// Function to create a new suspicious point in the database
export async function create(description, lat, len) {

    const { data, error } = await conn
      .from(collection)
      .insert([{ description, lat, len }]);
    if (data) {
      return data;
    }
    if (error) {
      return error.message;
    }
}
