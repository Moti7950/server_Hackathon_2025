import locationsDB from '../lib/supabase.js'
const conn = await locationsDB();


// the function create is used to create a new row in the table locations ,
// you need to enter 5 argoments:

// 1: collection ("locations");
// 2: description: ("teroris in chamas");
// 3: type: ("soldeir"  / "terorist");
// 4: lat: North–south position on Earth. example (342.444)
// 5: len:  East–west position on Earth. example (382.474)


export async function create(collection, description, type, lat, len) {
    const { data, error } = await conn.from(collection)
        .insert({ description: description, lat: lat, len: len, type: type })
    if (error) { return error.message };
    if (data) { return data }

}

// this function is used for read the collection;


export async function read(collection) {
    const { data, error } = await conn.from(collection).select('*');
    if (error) { return error.message };
    if (data) { return data }

}

console.log(await read('locations'))
