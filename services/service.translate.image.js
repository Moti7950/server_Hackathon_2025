import { fixText } from "./apiAiFixText.js";
import { updateInputToCheck, raportBotFinish } from "./checkOutput.js";

export function describeAndReport(pictureOnFormat64) {
    (async () => {


        console.log("הנומתה רואית:");

        const imageDescription = await fixText(pictureOnFormat64);
        updateInputToCheck(imageDescription);

        const riskReport = raportBotFinish();
        console.log("ןוכיס חוד:", riskReport);
    })();
}