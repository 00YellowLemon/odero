"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words text-zinc-800 dark:text-zinc-100 leading-relaxed font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm" {...props} />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-zinc-50 dark:bg-zinc-900/50" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="text-zinc-700 dark:text-zinc-300" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="my-2 leading-relaxed" {...props} />
          ),
          h1: ({ ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-zinc-900 dark:text-zinc-50" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-lg font-bold mt-3 mb-2 text-zinc-900 dark:text-zinc-50" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-base font-semibold mt-3 mb-1 text-zinc-900 dark:text-zinc-50" {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            return inline ? (
              <code className="bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800 dark:text-zinc-200" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-xs font-mono my-2 border border-zinc-800/80">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
