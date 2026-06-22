"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  isStreaming,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the height of textarea as content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to compute scrollHeight
    textarea.style.height = "auto";
    const computedHeight = textarea.scrollHeight;
    
    // Clamp height between 44px (1 line) and 160px
    textarea.style.height = `${Math.min(computedHeight, 160)}px`;
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isStreaming) {
        onSend(input.trim());
        setInput("");
      }
    }
  };

  return (
    <div className="p-2.5 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800/80">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-1.5 focus-within:ring-1 focus-within:ring-amber-500/30 focus-within:border-amber-500/50 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Odero Order Assistant..."
            className="w-full resize-none bg-transparent border-0 focus:ring-0 outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 py-2.5 px-3 max-h-40 min-h-[40px] scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 leading-relaxed font-sans"
          />
          
          <div className="flex justify-end items-center px-1.5 pb-1">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 p-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
                title="Stop generation"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer ${
                  input.trim()
                    ? "bg-amber-500 text-zinc-950 hover:scale-105 active:scale-95"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none"
                }`}
                title="Send message"
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-[10px] text-center text-zinc-650 dark:text-zinc-500 mt-2 select-none">
          Odero AI Agent can make mistakes. Please verify availability, stock status, pricing, and orders with human staff.
        </p>
      </form>
    </div>
  );
}
