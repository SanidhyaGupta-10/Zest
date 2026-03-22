"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotes = void 0;
const llm_router_1 = require("../../../providers/llm.router");
const notes_prompt_1 = require("../prompts/notes.prompt");
const generateNotes = async (topic) => {
    const prompt = (0, notes_prompt_1.notesPrompt)(topic);
    const result = await (0, llm_router_1.generateFromLLM)(prompt);
    return typeof result === "string" ? result : JSON.stringify(result);
};
exports.generateNotes = generateNotes;
