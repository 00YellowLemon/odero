"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  PanelLeft, 
  Smartphone, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Settings, 
  Sparkles,
  ArrowRight,
  User,
  Clock,
  MapPin,
  CreditCard,
  Wrench,
  Package,
  AlertTriangle,
  UserCheck
} from "lucide-react";
import { Message, ToolCall } from "../types";
import Markdown from "./Markdown";

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onSuggestionClick: (prompt: string) => void;
}

export default function ChatArea({
  messages,
  isStreaming,
  isSidebarOpen,
  setIsSidebarOpen,
  onSuggestionClick,
}: ChatAreaProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of the chat list on message updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const suggestions = [
    {
      title: "Check Inventory",
      desc: "Check stock & price for specific spare parts",
      icon: <Search className="h-4 w-4 text-amber-500" />,
      prompt: "Can you check if you have Samsung A15 LCD screen and A14 battery in stock?"
    },
    {
      title: "Draft an Order",
      desc: "Prepare an order draft for verified parts",
      icon: <Package className="h-4 w-4 text-emerald-500" />,
      prompt: "I want to place an order for 2 Samsung A32 Screens and 1 Spark 10 Charging Port."
    },
    {
      title: "Shop Location & Hours",
      desc: "Working hours and physical location details",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
      prompt: "Where is your shop located, and what are your working hours?"
    },
    {
      title: "Delivery Options",
      desc: "Shipping rates within Nairobi and upcountry",
      icon: <MapPin className="h-4 w-4 text-purple-500" />,
      prompt: "What are your delivery options and rates for Nairobi and other towns?"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Open sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm md:text-base">
              Odero Order Assistant
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full select-none">
              AI Agent
            </span>
          </div>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
          Luthuli Avenue, Nairobi
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
      >
        {messages.length === 0 ? (
          /* Welcome Screen dashboard */
          <div className="max-w-2xl mx-auto py-12 md:py-20 flex flex-col items-center text-center space-y-8 select-none">
            <div className="relative">
              <div className="bg-amber-500 dark:bg-amber-500 text-zinc-950 p-4 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Smartphone className="h-10 w-10" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-1 rounded-full border-2 border-white dark:border-zinc-900">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Odero Mobile Spare Parts
              </h1>
              <p className="text-sm md:text-base text-zinc-650 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                Welcome! I can help you search inventory, verify spare part availability, calculate order totals, and create order drafts for mobile phones and tablet parts.
              </p>
            </div>

            {/* Quick Action Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left mt-4">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(s.prompt)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/50 dark:hover:border-amber-500/40 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-amber-50/20 dark:hover:bg-amber-500/5 group text-left transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20 transition-colors">
                      {s.icon}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm">
                      {s.title}
                    </span>
                  </div>
                  <div className="text-zinc-650 dark:text-zinc-400 text-xs flex items-center justify-between gap-2">
                    <span className="line-clamp-2 leading-relaxed">{s.desc}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation messages */
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => {
              const isUser = message.role === "user";
              
              return (
                <div 
                  key={message.id}
                  className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar (Left aligned for AI) */}
                  {!isUser && (
                    <div className="h-8 w-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      <Wrench className="h-4.5 w-4.5" />
                    </div>
                  )}

                  {/* Message Bubble container */}
                  <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                    
                    {/* Tool Calls Log Panel (rendered prior to the assistant response text) */}
                    {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="w-full space-y-1 mb-2">
                        {message.toolCalls.map((tool) => (
                          <ToolCallCard key={tool.id} tool={tool} />
                        ))}
                      </div>
                    )}

                    {/* Speech Text Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-br-sm"
                        : message.isError
                        ? "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-bl-sm p-4 w-full"
                        : "text-zinc-800 dark:text-zinc-100 rounded-bl-sm min-h-[1.5rem]"
                    }`}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="relative">
                          {message.content ? (
                            <Markdown content={message.content} />
                          ) : isStreaming && message === messages[messages.length - 1] ? (
                            <div className="flex items-center gap-1 py-1.5">
                              <span className="h-2 w-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-2 w-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-2 w-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          ) : (
                            <p className="italic text-zinc-500 text-xs">No response content.</p>
                          )}

                          {/* Streaming Blinking Cursor block */}
                          {isStreaming && message === messages[messages.length - 1] && message.content && (
                            <span className="inline-block h-3.5 w-1.5 bg-zinc-700 dark:bg-zinc-300 ml-1 rounded-sm animate-pulse align-middle" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Avatar (Right aligned) */}
                  {isUser && (
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-350 flex items-center justify-center shrink-0 shadow-sm border border-zinc-300 dark:border-zinc-800">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* Tool execution card sub-component */
interface ToolCallCardProps {
  tool: ToolCall;
}

function ToolCallCard({ tool }: ToolCallCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getToolIcon = () => {
    const name = tool.name.toLowerCase();
    if (name.includes("search")) return <Search className="h-3.5 w-3.5" />;
    if (name.includes("inventory")) return <Package className="h-3.5 w-3.5" />;
    if (name.includes("availability")) return <Package className="h-3.5 w-3.5" />;
    if (name.includes("alternative")) return <Wrench className="h-3.5 w-3.5" />;
    if (name.includes("create")) return <Package className="h-3.5 w-3.5" />;
    if (name.includes("status")) return <Settings className="h-3.5 w-3.5" />;
    if (name.includes("notify")) return <UserCheck className="h-3.5 w-3.5" />;
    return <Settings className="h-3.5 w-3.5" />;
  };

  const getStatusColor = () => {
    if (tool.status === "running") return "text-amber-500 animate-pulse";
    if (tool.status === "completed") return "text-emerald-500";
    return "text-rose-500";
  };

  const formatData = (data: any) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    return JSON.stringify(data, null, 2);
  };

  // Human-readable tool names matching odero-fr
  const getToolTitle = (name: string) => {
    const mapping: Record<string, string> = {
      search_products: "Searching products in inventory",
      get_inventory: "Checking stock & price information",
      check_order_availability: "Checking availability & totals",
      find_alternatives: "Finding compatible in-stock alternatives",
      create_order_draft: "Creating order draft",
      get_order_status: "Retrieving order draft details",
      notify_staff: "Escalating request to shop staff",
    };
    return mapping[name] || `Running tool: ${name}`;
  };

  return (
    <div className="w-full max-w-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40 select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-850/50 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
          <span className={getStatusColor()}>{getToolIcon()}</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {getToolTitle(tool.name)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          {tool.status === "running" && (
            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full select-none animate-pulse">
              active
            </span>
          )}
          {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 font-mono text-[10px] text-zinc-600 dark:text-zinc-450 space-y-2.5 max-h-60 overflow-y-auto">
          {tool.input && (
            <div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-450 mb-1 text-[9px] uppercase tracking-wider">Parameters:</div>
              <pre className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800/85 overflow-x-auto text-zinc-700 dark:text-zinc-300">
                {formatData(tool.input)}
              </pre>
            </div>
          )}
          {tool.output && (
            <div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-450 mb-1 text-[9px] uppercase tracking-wider">Result:</div>
              <pre className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800/85 overflow-x-auto whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {formatData(tool.output)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
