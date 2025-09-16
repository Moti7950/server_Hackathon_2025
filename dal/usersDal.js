import e from 'express';
import supabaseDb from '../lib/supabase.js'
const conn = await supabaseDb();

export async function checkUserExist(collection, username) {
    const { data, error } = await conn.from(collection).select('*').eq('username', username);
    if (error) { return error };
    if (data) { return data };
}           

// checkUserExist('users', 'shaya');