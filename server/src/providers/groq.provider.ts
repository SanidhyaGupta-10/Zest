import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY

const groq = new Groq({ apiKey: apiKey });

export const groqProvider = {
    generateQuestions: async (topic: string) => {
    // logic is here mean 
    // training ai what to do for User in more efficient way
    const prompt = `
        Generate 5 high-quality study questions about: ${topic}.
        Return ONLY a JSON array of strings.`;

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const content = response.choices[0]?.message?.content || "[]";

    try {
        return JSON.parse(content);
    } catch {
        return [content]; // fallback
    };
  }
};