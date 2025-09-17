import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const apiKey = process.env.API_KEY;

 
export async function describePicture(inputPictureFormatB64) {
  try {
    const filePath = "./output/image_test.png";
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { text: "מה מופיע בתמונה הזאת ואם התמונה מורכבת מכמה תמונות אז תתיחס לכל תמונה בפרד ואם יש קונטקס מארגן או כמה קונטקסטים מארגנים בין כמה תמונות או בין כל התמונות אז תכתוב בסוף את הקונטקסטים המארגנים אבלל אחרי שנתת הסבר מה יש בכל תמונה בנפרד ? תענה בעברית בלבד." },
      {
        inlineData: {
          data: inputPictureFormatB64,
          mimeType: "image/png"
        }
      }
    ]);
    return result.response.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error(" האיגש:", err);
  }
}


export async function fixText(inputPictureFormatB64) {
  let textOutput = await describePicture(inputPictureFormatB64);
  let counter = 0;

  while (!textOutput) {
    console.log("The system is trying, please wait a few moments.");
    textOutput = await describePicture(inputPictureFormatB64);
    counter++;
    if (counter >=9) {
      console.log("we are sorry but the api error");
      break
    }
  }

  let textAnswer = "";
  for (let i = textOutput.length - 1; i >= 0; i--) {
    textAnswer += textOutput[i];
  }

  console.log(textAnswer);
  return textAnswer;
}
