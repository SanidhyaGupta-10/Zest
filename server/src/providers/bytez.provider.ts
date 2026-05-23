import Bytez from "bytez.js";
import { LLMProvider } from "./types/provider.types.js";

const key = process.env.BYTEZ_API_KEY;

/**
 * @server\src\providers\bytez.provider.ts
 * @description Bytez Provider (Alternative fallback)
 */
export const bytezProvider: LLMProvider = {
  name: "Bytez",

  generate: async (fullPrompt: string): Promise<string> => {
    if (!key) throw new Error("BYTEZ_API_KEY missing");
    
    // @ts-ignore - Bytez types can be tricky
    const sdk = new Bytez(key);
    const model = sdk.model("openai/gpt-4o-mini"); // Fixed: GPT-5 doesn't exist yet

    const { error, output } = await model.run([
      { role: "user", content: fullPrompt }
    ]);

    if (error) {
      throw new Error(`Bytez Error: ${error}`);
    }

    return typeof output === 'string' ? output : JSON.stringify(output);
  },
};
