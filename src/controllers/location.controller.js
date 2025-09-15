import { read , getOneLocation, create} from '../../dal/locationsDal.js'

export default async function getLocations(req, res) {
    const result = await read('locations')
    res.status(200).send(await result);

}

export async function addLocation(req, res) {
    const { lat, len, description, type } = req.body;
    if (!lat || !len || !description || !type) {
        return res.status(400).send({ message: "all fields are required" })
    }
    const result = await create('locations', description, type, lat, len)
    res.status(201).send(`location added: ${await result}`);
}

export async function checkifexist(req, res) {
    const { lat, len } = req.params;
    if (!lat || !len) {
        return res.status(400).send({ message: "all fields are required" })
    }
    const result = await getOneLocation('locations', lat, len)
    res.status(200).send( result); 
} 