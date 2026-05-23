export const questionPrompt = (topic, context) => `
### Task
Act as an expert educator. Generate 5 high-quality study questions about: "${topic}".
${context ? `Use the provided context only to ensure questions are grounded in the user's specific data.` : `Answer using your knowledge clearly and concisely.`}

### Requirements
- **Diversity**: Include a mix of conceptual, factual, and applied questions based on Bloom's Taxonomy.
- **Accuracy**: Ensure all questions are technically correct and relevant to the topic.
- **Format**: Output MUST be a valid JSON array of objects.

${context ? `### Context\n${context}\n` : ""}

### JSON Schema
Each object in the array must follow this structure:
{
  "id": number,
  "question": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "category": "string"
}

### Constraints
- Return ONLY the JSON array.
- No conversational filler, preamble, or markdown code blocks (unless specified by the API's response_format).
- No explanation of the questions.
`;
