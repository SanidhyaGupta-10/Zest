export const summaryPrompt = (content: string) => `
### Task
Provide a high-impact, concise summary of the text provided below.

### Output Style
- **Format**: Use a brief introductory sentence followed by 3-5 high-level bullet points.
- **Tone**: Professional and objective.
- **Focus**: Capture the core thesis and key actionable takeaways.

### Constraints
- Total length must not exceed 150 words.
- Do not include meta-commentary (e.g., "This text is about...").
- If the content is technical, preserve essential terminology.

### Content to Summarize:
"""
${content}
"""
`;
