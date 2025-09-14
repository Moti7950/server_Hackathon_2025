// const fs = require('fs');
// const sharp = require("sharp");
// // const { libraryImages } = require("../imagesToAnalize.js");

// const urlTest = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFB4eYqlsMW7MeYtoiTHN3X8aPTvNrS-9eYw&s";
// // Download image from URL and save to file
// async function downloadImage(url, outputPath) {
//     const response = await fetch(url); // fetch מובנה ב-Node >=18
//     if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
//     const arrayBuffer = await response.arrayBuffer();
//     fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
//     return outputPath;
// }

// // width and height picture
// // לשים בתיקייה utility 
// export async function imageSize(imagePath) {
//     const metadata = await sharp(imagePath).metadata();
//     return { width: metadata.width, height: metadata.height };
// }

// // create meta data to know how mach divide picture 
// export async function canvasWraper(imagePath) {
//     const { width: imageWidth, height: imageHeight } = await imageSize(imagePath);

//     const zones = [];

//     for (let row = 0; row < Math.ceil(imageHeight / 384); row++) {
//         for (let col = 0; col < Math.ceil(imageWidth / 384); col++) {
//             const x = col * 384;
//             const y = row * 384;
//             zones.push({
//                 id: `{${x}:${y}}`,
//                 x,
//                 y,
//                 width: Math.min(384, imageWidth - x),
//                 height: Math.min(384, imageHeight - y),
//             });
//         }
//     }
//     return zones;
// }

// // real divided picture and save
// export async function realCutImages(imagePath, outputDir) {
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true })
//     }
//     const zones = await canvasWraper(imagePath);
//     const promises = zones.map(async (item) => {
//         const outputFilePath = `${outputDir}/tile_${item.id}.png`;
//         await sharp(imagePath)
//             .extract({ left: item.x, top: item.y, width: item.width, height: item.height })
//             .toFile(outputFilePath);
//     });
//     await Promise.all(promises);
// }



// // אבחון מה יש בכל תמונה באמצעות api והכנסה למערך נתונים
// // export function containImage() {

// // }

// // Process the single URL from urlTest
// // קוד חדש שצריך להבחן
// export async function processUrlTest(outputDir) {
//     try {
//         const imagePath = `${outputDir}/image_test.png`;
//         console.log(`Downloading image from: ${urlTest}`);
//         await downloadImage(urlTest, imagePath);

//         console.log(`Processing image: ${imagePath}`);
//         await realCutImages(imagePath, `${outputDir}/tiles_test`);
//         console.log(`Image processed and tiles saved to: ${outputDir}/tiles_test`);
//     } catch (error) {
//         console.error(`Error processing image from urlTest: ${urlTest}`, error);
//     }
// }

// processUrlTest('./output');








// קוד שנוצר כולו על ידי ai טעון תיקונים ושיפורים
// Rewritten code using ES Modules syntax
import fs from 'fs';
import sharp from "sharp";
import path from 'path';
import { libraryImages } from "../imagesToAnalize.js";

const urlTest = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFB4eYqlsMW7MeYtoiTHN3X8aPTvNrS-9eYw&s";

// Download image from URL and save to file
async function downloadImage(url, outputPath) {
    const response = await fetch(url); // fetch מובנה ב-Node >=18
    if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    return outputPath;
}

// width and height picture
export async function imageSize(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
}

// create meta data to know how much to divide picture 
export async function canvasWrapper(imagePath) {
    const { width: imageWidth, height: imageHeight } = await imageSize(imagePath);

    const zones = [];

    for (let row = 0; row < Math.ceil(imageHeight / 384); row++) {
        for (let col = 0; col < Math.ceil(imageWidth / 384); col++) {
            const x = col * 384;
            const y = row * 384;
            zones.push({
                id: `{${x}:${y}}`,
                x,
                y,
                width: Math.min(384, imageWidth - x),
                height: Math.min(384, imageHeight - y),
            });
        }
    }
    return zones;
}

// real divided picture and save
export async function realCutImages(imagePath, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const zones = await canvasWrapper(imagePath);
    const promises = zones.map(async (item) => {
        const outputFilePath = `${outputDir}/tile_${item.id}.png`;
        await sharp(imagePath)
            .extract({ left: item.x, top: item.y, width: item.width, height: item.height })
            .toFile(outputFilePath);
    });
    await Promise.all(promises);
}

// Process the single URL from urlTest
export async function processUrlTest(outputDir) {
    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const imagePath = `${outputDir}/image_test.png`;
        console.log(`Downloading image from: ${urlTest}`);
        await downloadImage(urlTest, imagePath);

        console.log(`Processing image: ${imagePath}`);
        await realCutImages(imagePath, `${outputDir}/tiles_test`);
        console.log(`Image processed and tiles saved to: ${outputDir}/tiles_test`);
    } catch (error) {
        console.error(`Error processing image from urlTest: ${urlTest}`, error);
    }
}

// Run the process
processUrlTest('./output'); 