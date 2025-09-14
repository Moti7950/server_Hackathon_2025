import sharp from "sharp";
//  פונקציה שמקבלת תמונה ומוציאה ממנה ת הערכים של האורך והרוחב שלה 
export async function imageSize(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
}


// פונקציה ליצירת מטא דאטה לכמה תמונות קטנות לחלק את התמונה ואיזה מידות לתת לה
export async function canvasWraper(imagePath) {
    const { width: imageWidth, height: imageHeight } = await imageSize(imagePath);

    const zones = [];

    for (let row = 0; row <  Math.floor(imageHeight/384); row++) {
        for (let col = 0; col < Math.floor(imageWidth/384); col++) {
            const x = col * Math.floor(imageWidth / 384);
            const y = row * Math.floor(imageHeight / 384);

            zones.push({
                id: `{${x}:${y}}`,
                x,
                y,
                width: Math.floor(imageWidth / 384),
                heigth: Math.floor(imageHeight / 384),
            });
        }
    }
    return zones;
}
// 001
// האם המערך zones בקוד כאן הוא מערך שמחזיר נתונים של מטא דאטה על התמונה

// האמיתית פונקציה שחותכת את התמונה 
export function realCutImages() {

}

// אבחון מה יש בכל תמונה באמצעות api והכנסה למערך נתונים 
export function containImage() {

}

