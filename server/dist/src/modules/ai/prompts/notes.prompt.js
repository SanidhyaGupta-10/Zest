"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesPrompt = void 0;
const notesPrompt = (topic) => `
### Task
Act as a professional academic assistant. Create comprehensive, structured study notes on: "${topic}".

### Structural Guidelines
- **Title**: A clear, centered title.
- **Introduction**: A 2-sentence high-level overview.
- **Hierarchical Sections**: Use ## for major concepts and ### for sub-components.
- **Formatting**: Use **bolding** for terminology and bullet points for lists.

### Required Content
- **Key Concepts**: Define the 3-5 most critical ideas.
- **Comparison/Context**: Explain how this topic relates to similar concepts.
- **The "Big Picture"**: A final "In Short" summary at the bottom.

### Constraints
- Maintain a scholarly yet accessible tone.
- Use whitespace effectively for readability.
- If the topic is technical, include a "Syntax" or "Formula" block if applicable.

Topic: ${topic}
`;
exports.notesPrompt = notesPrompt;
