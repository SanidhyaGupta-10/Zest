// Chats History
export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  messages?: Message[];
}

// Notes History
export interface Note {
  id: string;
  topic: string;
  notes: string;
  createdAt: string;
}

// Questions History
export interface QuestionItem {
  id: number;
  question: string;
  difficulty: string;
  category: string;
  hint?: string;
  solution?: string;
}

export interface Question {
  id: string;
  topic: string;
  questions: QuestionItem[];
  createdAt: string;
}

// Summaries History
export interface Summary {
  id: string;
  content: string;
  result: string;
  createdAt: string;
}
