"use client";

import React, { useState } from "react";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Moon, 
  Sun, 
  PanelLeftClose, 
  Smartphone 
} from "lucide-react";
import { ChatSession } from "../types";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onUpdateSessionTitle: (id: string, title: string) => void;
  onClearAllSessions: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onUpdateSessionTitle,
  onClearAllSessions,
  isSidebarOpen,
  setIsSidebarOpen,
  theme,
  setTheme,
}: SidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onUpdateSessionTitle(id, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 md:z-auto md:static w-64 bg-zinc-950 text-zinc-200 flex flex-col h-full border-r border-zinc-800/80 shrink-0 select-none transition-transform duration-300 md:transition-none ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:hidden"
      }`}>
        {/* Top Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-zinc-800/50">
          <div className="flex items-center gap-2 font-semibold text-white">
            <div className="bg-amber-500 p-1.5 rounded-lg text-zinc-950 flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Mobitop Shop</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close sidebar"
          >
            <PanelLeftClose className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onCreateSession}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 text-white rounded-lg text-sm font-medium border border-zinc-800 transition-all shadow-sm hover:scale-[1.01] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {sessions.length === 0 ? (
            <div className="text-center text-xs text-zinc-650 py-8 px-4">
              No recent chats
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingSessionId;

              return (
                <div
                  key={session.id}
                  onClick={() => !isEditing && onSelectSession(session.id)}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                    isActive 
                      ? "bg-zinc-900 text-white font-medium border border-zinc-850 shadow-inner" 
                      : "hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500" />
                  
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-zinc-800 text-white text-xs px-1.5 py-0.5 rounded border border-zinc-700 outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(session.id, e as any);
                          if (e.key === "Escape") handleCancelEdit(e as any);
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveEdit(session.id, e)}
                        className="p-0.5 hover:bg-zinc-700 rounded text-emerald-400 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-0.5 hover:bg-zinc-700 rounded text-rose-400 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="truncate flex-1 pr-12 text-xs py-0.5">
                      {session.title || "Untitled Chat"}
                    </span>
                  )}

                  {/* Hover Actions */}
                  {!isEditing && (
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 pl-4 py-1.5 rounded bg-gradient-to-l ${
                      isActive ? "from-zinc-900 via-zinc-900" : "from-zinc-950 via-zinc-950"
                    }`}>
                      <button
                        onClick={(e) => handleStartEdit(session.id, session.title, e)}
                        className="p-1 hover:bg-zinc-800 hover:text-white rounded text-zinc-500 transition-colors cursor-pointer"
                        title="Rename chat"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 hover:bg-zinc-800 hover:text-rose-400 rounded text-zinc-500 transition-colors cursor-pointer"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-3 border-t border-zinc-850 bg-zinc-950 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-4 w-4" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                Light Mode
              </>
            )}
          </button>
          
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete all chat history?")) {
                  onClearAllSessions();
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-500 hover:text-rose-450 hover:bg-zinc-900/30 rounded-lg text-xs transition-colors text-left cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Clear all chats
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
