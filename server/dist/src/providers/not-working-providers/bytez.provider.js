"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytezProvider = void 0;
const bytez_js_1 = __importDefault(require("bytez.js"));
// Initialize with your key
const key = process.env.BYTEZ_API_KEY;
const sdk = new bytez_js_1.default(key);
const model = sdk.model("openai/gpt-5-mini");
exports.bytezProvider = {
    generate: async (fullPrompt) => {
        // Standard chat array for Bytez
        const { error, output } = await model.run([
            {
                role: "user",
                content: fullPrompt
            }
        ]);
        if (error) {
            console.error("Bytez Error:", error);
            return "";
        }
        // Bytez returns the string response directly in 'output'
        return typeof output === 'string' ? output : JSON.stringify(output);
    },
};
