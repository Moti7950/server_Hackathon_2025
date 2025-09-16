import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// צריך להעביר אותו ל env ולייב אותו 
// const apiKey = process.env.API_KEY;
const apiKey = "AIzaSyD8tU7BbFuttnj7_tJulEYyxMjk711xQOQ";
const filePath = "./output/image_test.png";
const b64 = fs.readFileSync(filePath).toString("base64");

export async function describeTile() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { text: "מה מופיע בתמונה הזאת ואם התמונה מורכבת מכמה תמונות אז תתיחס לכל תמונה בפרד ואם יש קונטקס מארגן בין כמה תמונות או בין כל התמונות אז תכתוב בסוף את הקונטקסט המארגן אבלל אחרי שנתת הסבר מה יש בכל תמונה בנפרד ? תענה בעברית." },
      {
        inlineData: {
          data: b64,
          mimeType: "image/png"
        }
      }
    ]);
    // console.log(result.response.candidates[0].content.parts[0].text);
    return result.response.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error(" האיגש:", err);
  }
}

export async function fixText() {
  const textOutput = await describeTile();
  // let textAnswer = "";
  for (let i = textOutput.length - 1; i >= 0; i--) {
    textAnswer += textOutput[i];
  }
  console.log(textAnswer);
}
fixText()
