import Groq from "groq-sdk";

const key = process.env.GROQ_API_KEY!;
const groq = new Groq({ apiKey: key });

export const groqProvider = {
  generate: async (fullPrompt: string) => {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: fullPrompt }],
      // Use json_object only if your prompt explicitly asks for JSON
      // response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Clean response
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
    cleaned = cleaned.replace(/^\s*(ANSWER|Answer|RESPONSE|Response|RESULT|Result):\s*/i, "");
    cleaned = cleaned.trim();
    
    if (cleaned.startsWith("```")) {
      const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    }
    
    return cleaned;
  },
};
