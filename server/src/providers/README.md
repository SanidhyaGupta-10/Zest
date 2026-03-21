# LLM Providers & Router

This directory handles standardizing interactions with various AI providers (OpenAI, Gemini, Groq, DeepSeek, etc.).

## 📁 Structure

- **`llm.router.ts`**: The main interface for AI generation. It uses a **Multi-Provider Fallback** strategy.
- **`openai.provider.ts`, `gemini.provider.ts`, etc.**: Individual adapter implementation for each API.

## 🚀 Performance Strategy

To ensure a premium user experience (responses under 2-3 seconds), we prioritize providers based on speed and accuracy:

1. **Groq (Llama 3.3)**: Extremely fast inference for general tasks.
2. **Gemini**: High-speed, high-reasoning fallback.
3. **DeepSeek / Bytez**: Alternative reliable providers.
4. **OpenAI**: Last-resort fallback due to latency/cost.

---

> [!IMPORTANT]
> Always use `generateWithFallback` instead of calling a specific provider directly. This ensures the application remains robust even if one provider's API goes down.
