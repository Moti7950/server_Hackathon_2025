import locationsDB from '../lib/supabase.js'
const conn = await locationsDB();

export async function checkUserExist(collection, username) {
    const { data, error } = await conn.from(collection).select('*').eq('username', username);
    if (error) { return false };
    if (data) { return true }
}   

// checkUserExist('users', 'shaya');