import Bytez from "bytez.js";
// Initialize with your key
const key = process.env.BYTEZ_API_KEY;
const sdk = new Bytez(key);
const model = sdk.model("openai/gpt-5-mini");
export const bytezProvider = {
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
