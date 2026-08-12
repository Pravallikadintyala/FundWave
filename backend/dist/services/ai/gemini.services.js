"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsight = generateInsight;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
async function generateInsight(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });
    return response.text ?? "No response generated.";
}
exports.default = generateInsight;
//# sourceMappingURL=gemini.services.js.map