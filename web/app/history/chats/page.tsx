"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronRight, Clock, Bot, User, ArrowLeft } from "lucide-react";
import { aiApi } from "@/lib/api";
import Markdown from "@/components/Markdown";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  messages?: Message[];
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  createdAt: string;
}

export default function ChatHistoryPage() {
  const { userId, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await aiApi.getChats(token || undefined);
        if (response.data?.chats) {
          setChats(response.data.chats);
        }
      } catch (err) {
        setError("Failed to load chat history");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId, getToken]);

  const handleChatClick = async (chat: Chat) => {
    try {
      const token = await getToken();
      const response = await aiApi.getChatMessages(chat.id, token || undefined);
      if (response.data?.chat?.messages) {
        setSelectedChat({
          ...chat,
          messages: response.data.chat.messages,
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <MessageSquare className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Chat History</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/3 mb-3" />
              <div className="h-4 bg-white/5 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="glass-card p-8 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 text-red-400">
            <MessageSquare className="size-6" />
            <h2 className="text-xl font-black">Error Loading History</h2>
          </div>
          <p className="text-white/60 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Chat Detail View
  if (selectedChat) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => setSelectedChat(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white/60" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{selectedChat.title || "Untitled Chat"}</h1>
            <p className="text-sm text-white/40">{formatDate(selectedChat.createdAt)}</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence>
            {selectedChat.messages?.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`size-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    msg.role === "user"
                      ? "bg-blue-600 border-blue-400/50"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="size-5" />
                  ) : (
                    <Bot className="size-5 text-blue-400" />
                  )}
                </div>
                <div
                  className={`px-6 py-4 rounded-3xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white/5 border border-white/10 rounded-tl-none"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Markdown content={msg.content} />
                  ) : (
                    <p className="font-medium">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Chat List View
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <MessageSquare className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Chat History</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          View and continue your previous conversations with the AI assistant.
        </p>
      </motion.div>

      {chats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 inline-flex mb-4">
            <MessageSquare className="size-8 text-white/30" />
          </div>
          <h3 className="text-xl font-black text-white/60 mb-2">No Chat History</h3>
          <p className="text-white/40">
            Start a conversation in the Chat tab to see it here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {chats.map((chat, idx) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleChatClick(chat)}
                className="glass-card p-6 cursor-pointer group hover:border-blue-500/40 hover:bg-white/4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <MessageSquare className="size-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {chat.title || "Untitled Chat"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                        <Clock className="size-3" />
                        <span>{formatDate(chat.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
