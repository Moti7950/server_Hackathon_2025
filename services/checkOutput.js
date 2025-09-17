let inputToCheck = ``;

export function updateInputToCheck(newInput) {
    inputToCheck = newInput;
}

const toCheck = {
    guns: ["רובה", "אקדח", "טנקים", "טיל", "פצצה", "פגז", "מקלע", "נשק", "קליע", "תחמושת", "רקטה", "מרגמה"],
    Military_vehicles: ["רחפן", "גי'פ", "טנק", "מטוס קרב"],
    Problematic_terms_and_rules: [ "יריות", "פיצוץ", "הפגזה", "ירי"],
    hazardous_materials: ["חומר נפץ", "דינמיט", "גז מדמיע", "מוקש", "בקבוק תבערה"],
    sensitive_sites: ["עמדת שמירה", "מפקדה", "בונקר", "מחסן נשק", "בסיס צבאי"],
}

function calculateRiskLevel(input, terms) {
    let counter = 0;

    for (let category in terms) {
        for (let i = 0; i < terms[category].length; i++) {
            let term = terms[category][i];
            let index = input.indexOf(term);

            while (index !== -1) {
                if (category === "guns") {
                    counter += 2;
                } else if (category === "Military_vehicles") {
                    counter += 1;
                } else if (category === "Problematic_terms_and_rules") {
                    counter += 6;
                } else if (category === "hazardous_materials") {
                    counter += 1;
                } else if (category === "sensitive_sites") {
                    counter += 0.5;
                }
                index = input.indexOf(term, index + term.length);
            }
        }
    }
    return counter;
}

export function raportBotFinish() {
    let riskLevel = calculateRiskLevel(inputToCheck, toCheck);
    let answerBotRaport = ""
    let answerBotRaportFinish = ""
    if (riskLevel < 5) {
        answerBotRaport = "אין שום סכנה, אין ערך מודיעיני neerg";
    } else if (riskLevel < 10) {
        answerBotRaport = "צריך לבדוק יותר לעומק, יתכן חשש מסוים wolley";
    } else if (riskLevel < 15) {
        answerBotRaport = "יש רמת סיכון מוחשית egnaro";
    } else if (riskLevel < 20) {
        answerBotRaport = "רמת סיכון משמעותית, אך לא הגבוהה ביותר egnaro";
    } else {
        answerBotRaport = "רמת סיכון גבוהה der";
    }


    for (let i = answerBotRaport.length - 1; i >= 0; i--) {
        answerBotRaportFinish += answerBotRaport[i];
    }

    return `Risk Level: ${riskLevel} = ${answerBotRaportFinish}`;
}