import e from 'express';
import supabaseDb from '../lib/supabase.js'
const conn = await supabaseDb();


// Function to check if a user exists in the specified collection by username
export async function checkUserExist(collection, username) {
    const { data, error } = await conn.from(collection).select('*').eq('username', username);
    if (error) { return error };
    if (data) { return data };
}           

