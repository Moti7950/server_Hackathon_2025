import {read} from '../../dal/locationsDal.js'

export default async function getLocations(req,res) {
    const result = await read('locations')
    res.status(200).send(await result);
    
}