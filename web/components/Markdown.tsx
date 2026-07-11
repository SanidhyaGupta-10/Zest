"use client";

import { MarkdownProps } from "@/types/component.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Extracted CodeBlock component to avoid React Hooks violation.
 * useState cannot be called inside a render prop (ReactMarkdown's `code` component).
 */
function CodeBlock({ className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);
  const inline = !match && !String(children).includes("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 backdrop-blur-md">
        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
          {match?.[1] || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white"
        >
          {copied ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match?.[1] || "text"}
        PreTag="div"
        className="bg-black/40! m-0! p-4! text-sm! scrollbar-thin"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-invert max-w-none wrap-break-word">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-black mt-6 mb-4 text-white uppercase tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-black mt-5 mb-3 text-white/90 uppercase tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-black mt-4 mb-2 text-white/80 uppercase tracking-tight">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-gray-300 leading-relaxed last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          code: CodeBlock,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 py-1 italic text-gray-400 bg-blue-500/5 rounded-r-lg my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
              <table className="w-full text-sm text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-3 font-black text-white/40 uppercase tracking-widest text-[10px] border-b border-white/10">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 text-gray-300 border-b border-white/5">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
