import fs from 'fs';
import sharp from "sharp";
import { fixText } from "./apiAiFixText.js"; 

const urlTest = "https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-0310-620a-bca8-2b36916ebf95/raw?se=2025-09-16T08%3A29%3A45Z&sp=r&sv=2024-08-04&sr=b&scid=6ef0e8e9-5eca-540e-b37a-236928660975&skoid=0da8417a-a4c3-4a19-9b05-b82cee9d8868&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-16T06%3A14%3A55Z&ske=2025-09-17T06%3A14%3A55Z&sks=b&skv=2024-08-04&sig=016yRw/9HH7r5%2BLQV0heqyiXW7Q5Q5pumce0ZJVDOQs%3D";

// Download image from URL and save to file
async function downloadImage(url, outputPath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
    return outputPath;
}

// width and height picture
// לשים בתיקייה utility 
export async function imageSize(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
}

// create meta data to know how mach divide picture 
export async function canvasWraper(imagePath) {
    const { width: imageWidth, height: imageHeight } = await imageSize(imagePath);

    const zones = [];

    for (let row = 0; row < Math.ceil(imageHeight / 384); row++) {
        for (let col = 0; col < Math.ceil(imageWidth / 384); col++) {
            const x = col * 384;
            const y = row * 384;
            zones.push({
                id: `${x}_${y}`,
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
        fs.mkdirSync(outputDir, { recursive: true })
    }
    const zones = await canvasWraper(imagePath);
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
        const imagePath = `${outputDir}/image_test.png`;
        console.log(`Downloading image from: ${urlTest}`);
        await downloadImage(urlTest, imagePath);

        console.log(`Processing image: ${imagePath}`);
        await realCutImages(imagePath, `${outputDir}/tiles_test`);
        console.log(`Image processed and tiles saved to: ${outputDir}/tiles_test`);
        
        const describe = await fixText();
        console.log(`the describe of this picture`);
    } catch (error) {
        console.error(`Error processing image from urlTest: ${urlTest}`, error);
    }
}

processUrlTest('./output');