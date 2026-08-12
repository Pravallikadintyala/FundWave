"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
async function test() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Suggest savings tips for students",
        });
        console.log(response.text);
    }
    catch (err) {
        console.error(err);
    }
}
test();
//# sourceMappingURL=test_gemini.js.map