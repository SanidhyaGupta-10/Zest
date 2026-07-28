// Groq Provider: Wrapper around Groq SDK (Llama 3.3 70B) with response sanitization logic.
import Groq from "groq-sdk";

const key = process.env.GROQ_API_KEY!;
const groq = new Groq({ apiKey: key });

export const groqProvider = {
  generate: async (fullPrompt: string) => {
    // Dispatch request to Groq fast chat completion API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: fullPrompt }
      ],
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Clean raw LLM output (remove reasoning tags, prefixes, and markdown blocks)
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
    cleaned = cleaned.replace(/^\s*(ANSWER|Answer|RESPONSE|Response|RESULT|Result):\s*/i, "");
    cleaned = cleaned.trim();
    
    if (cleaned.startsWith("```")) {
      const match = cleaned.match(/^```\w*\s*([\s\S]*?)\s*```$/);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    }
    
    return cleaned;
  },
};
