// 100 points across Gaza Strip, 20 per main area, ~20m apart
const basePoints = [
    { lat: 31.501, len: 34.466, description: "Rafah", type: "soldier" },
    { lat: 31.528, len: 34.445, description: "Khan Yunis", type: "soldier" },
    { lat: 31.535, len: 34.475, description: "Deir al-Balah", type: "soldier" },
    { lat: 31.537, len: 34.510, description: "Gaza City", type: "soldier" },
    { lat: 31.551, len: 34.535, description: "Beit Hanoun", type: "soldier" }
];
function getRandomOffset(minMeters, maxMeters) {
        // 1 deg lat ~ 111320m, 1 deg lon ~ 90000m (approx in Gaza)
        const min = minMeters;
        const max = maxMeters;
        const r = Math.random() * (max - min) + min; // meters
        const angle = Math.random() * 2 * Math.PI;
        const dLat = (r * Math.cos(angle)) / 111320;
        const dLon = (r * Math.sin(angle)) / 90000;
        return { dLat, dLon };
}

const arr = [];
const minDelta = 20; // meters
const maxDelta = 20000; // meters

// User-defined polygon (clockwise)
const gazaPolygon = [
    [31.379017, 34.357885],
    [31.401291, 34.313596],
    [31.485648, 34.482511],
    [31.519019, 34.429296],
    [31.379017, 34.357885]
];

// Ray-casting algorithm for point-in-polygon
function isInGaza(lat, lon) {
    let x = lat, y = lon;
    let inside = false;
    for (let i = 0, j = gazaPolygon.length - 1; i < gazaPolygon.length; j = i++) {
        let xi = gazaPolygon[i][0], yi = gazaPolygon[i][1];
        let xj = gazaPolygon[j][0], yj = gazaPolygon[j][1];
        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi);    
        if (intersect) inside = !inside;
    }
    return inside;
}

// Generate 100 random points inside the user polygon
function randomInRange(a, b) {
    return Math.random() * (b - a) + a;
}

// Find bounding box
const lats = gazaPolygon.map(p => p[0]);
const lons = gazaPolygon.map(p => p[1]);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const minLon = Math.min(...lons);
const maxLon = Math.max(...lons);

arr.length = 0;
const usedCoords = new Set();
let count = 0;
// 300 soldiers
while (count < 300) {
    const lat = +(randomInRange(minLat, maxLat)).toFixed(6);
    const lon = +(randomInRange(minLon, maxLon)).toFixed(6);
    const key = `${lat},${lon}`;
    if (isInGaza(lat, lon) && !usedCoords.has(key)) {
        arr.push({ lat, len: lon, description: `Point ${count+1}`, type: "soldier" });
        usedCoords.add(key);
        count++;
    }
}
// 400 terrorists
let tCount = 0;
while (tCount < 400) {
    const lat = +(randomInRange(minLat, maxLat)).toFixed(6);
    const lon = +(randomInRange(minLon, maxLon)).toFixed(6);
    const key = `${lat},${lon}`;
    if (isInGaza(lat, lon) && !usedCoords.has(key)) {
        arr.push({ lat, len: lon, description: `Point ${300 + tCount + 1}`, type: "terrorist" });
        usedCoords.add(key);
        tCount++;
    }
}

// console.log(arr);


async function addlocationsfromarr(arr) {
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        await fetch('http://localhost:6578/locations', {
            method: 'POST',
            headers: {  'Content-Type': 'application/json' },
            body: JSON.stringify(element)
        });
   
}
console.log('finished adding locations');
}





await addlocationsfromarr(arr)