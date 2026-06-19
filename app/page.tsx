"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import { ChatSession, Message, ToolCall } from "./types";

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    // Theme load
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Sessions load
    const savedSessions = localStorage.getItem("sessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        
        const savedActiveId = localStorage.getItem("activeSessionId");
        if (savedActiveId && parsed.some((s: ChatSession) => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        } else if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }

    // Close sidebar by default on mobile screens
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // 2. Sync Theme to Document and LocalStorage
  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 3. Sync Sessions to LocalStorage on changes
  const saveSessionsToLocalStorage = (updatedSessions: ChatSession[]) => {
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  const saveActiveSessionIdToLocalStorage = (id: string | null) => {
    if (id) {
      localStorage.setItem("activeSessionId", id);
    } else {
      localStorage.removeItem("activeSessionId");
    }
  };

  // 4. Session Action Handlers
  const handleCreateSession = () => {
    if (isStreaming) return;
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New Chat",
      messages: [],
      lastModified: Date.now()
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    saveSessionsToLocalStorage(updated);
    saveActiveSessionIdToLocalStorage(newSession.id);
  };

  const handleSelectSession = (id: string) => {
    if (isStreaming) return; // Prevent switching while generating
    setActiveSessionId(id);
    saveActiveSessionIdToLocalStorage(id);
  };

  const handleDeleteSession = (id: string) => {
    if (isStreaming && id === activeSessionId) return; // Prevent deleting active generating stream
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessionsToLocalStorage(updated);

    if (activeSessionId === id) {
      const nextActive = updated.length > 0 ? updated[0].id : null;
      setActiveSessionId(nextActive);
      saveActiveSessionIdToLocalStorage(nextActive);
    }
  };

  const handleUpdateSessionTitle = (id: string, title: string) => {
    const updated = sessions.map(s => s.id === id ? { ...s, title, lastModified: Date.now() } : s);
    setSessions(updated);
    saveSessionsToLocalStorage(updated);
  };

  const handleClearAllSessions = () => {
    if (isStreaming) return;
    setSessions([]);
    setActiveSessionId(null);
    localStorage.removeItem("sessions");
    localStorage.removeItem("activeSessionId");
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // 5. Message Send & SSE stream consumer
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    let currentSessionId = activeSessionId;
    let updatedSessions = [...sessions];

    // If no active session exists, create one on-the-fly
    if (!currentSessionId) {
      currentSessionId = `session_${Date.now()}`;
      const newSession: ChatSession = {
        id: currentSessionId,
        title: text.length > 30 ? text.substring(0, 30) + "..." : text,
        messages: [],
        lastModified: Date.now()
      };
      updatedSessions = [newSession, ...updatedSessions];
      setSessions(updatedSessions);
      setActiveSessionId(currentSessionId);
      saveActiveSessionIdToLocalStorage(currentSessionId);
    }

    // Prepare User & Assistant messages
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now()
    };

    const assistantMsgId = `msg_${Date.now() + 1}`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: Date.now() + 1,
      toolCalls: []
    };

    // Update active session messages in state
    updatedSessions = updatedSessions.map(session => {
      if (session.id === currentSessionId) {
        // Auto rename title if it was default
        const title = session.title === "New Chat" 
          ? (text.length > 30 ? text.substring(0, 30) + "..." : text)
          : session.title;
        
        return {
          ...session,
          title,
          messages: [...session.messages, userMsg, assistantMsg],
          lastModified: Date.now()
        };
      }
      return session;
    });

    // Sort active session to the top of the sidebar list
    const activeSessionIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
    if (activeSessionIndex > 0) {
      const [activeSession] = updatedSessions.splice(activeSessionIndex, 1);
      updatedSessions.unshift(activeSession);
    }

    setSessions(updatedSessions);
    saveSessionsToLocalStorage(updatedSessions);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://odero-agent-service-1013482758027.us-central1.run.app";
    try {
      const response = await fetch(`${apiUrl}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          thread_id: currentSessionId
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body available for streaming");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep unfinished line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.substring(6);
            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const event = JSON.parse(dataStr);
              
              setSessions(prevSessions => {
                const updated = prevSessions.map(session => {
                  if (session.id === currentSessionId) {
                    const messagesCopy = [...session.messages];
                    const astMsgIdx = messagesCopy.findIndex(m => m.id === assistantMsgId);
                    if (astMsgIdx !== -1) {
                      const astMsg = { ...messagesCopy[astMsgIdx] };
                      
                      if (event.type === "token") {
                        astMsg.content += event.content;
                      } else if (event.type === "tool_start") {
                        const newTool: ToolCall = {
                          id: `${event.tool}_${Date.now()}`,
                          name: event.tool,
                          status: "running",
                          input: event.input
                        };
                        astMsg.toolCalls = [...(astMsg.toolCalls || []), newTool];
                      } else if (event.type === "tool_end") {
                        astMsg.toolCalls = (astMsg.toolCalls || []).map(t => {
                          if (t.name === event.tool && t.status === "running") {
                            return { ...t, status: "completed", output: event.output };
                          }
                          return t;
                        });
                      } else if (event.type === "error") {
                        astMsg.isError = true;
                        astMsg.content += `\n\n[Agent Error: ${event.content}]`;
                      }

                      messagesCopy[astMsgIdx] = astMsg;
                    }
                    return { ...session, messages: messagesCopy, lastModified: Date.now() };
                  }
                  return session;
                });
                saveSessionsToLocalStorage(updated);
                return updated;
              });

            } catch (e) {
              console.error("Error parsing JSON chunk:", e, dataStr);
            }
          }
        }
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream reading aborted by user.");
      } else {
        console.error("Fetch/Stream error:", error);
        setSessions(prevSessions => {
          const updated = prevSessions.map(session => {
            if (session.id === currentSessionId) {
              const messagesCopy = [...session.messages];
              const astMsgIdx = messagesCopy.findIndex(m => m.id === assistantMsgId);
              if (astMsgIdx !== -1) {
                const astMsg = { ...messagesCopy[astMsgIdx], isError: true };
                astMsg.content = `An error occurred while connecting to the agent: ${error.message || error}`;
                messagesCopy[astMsgIdx] = astMsg;
              }
              return { ...session, messages: messagesCopy, lastModified: Date.now() };
            }
            return session;
          });
          saveSessionsToLocalStorage(updated);
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  if (theme === null) {
    // Avoid flash on loading theme
    return <div className="h-dvh w-full bg-white dark:bg-zinc-950" />;
  }

  return (
    <div className={`flex h-dvh w-full overflow-hidden font-sans ${theme}`}>
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
        onUpdateSessionTitle={handleUpdateSessionTitle}
        onClearAllSessions={handleClearAllSessions}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        theme={theme}
        setTheme={handleSetTheme}
      />
      
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <ChatArea
          messages={
            sessions.find(s => s.id === activeSessionId)?.messages || []
          }
          isStreaming={isStreaming}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onSuggestionClick={handleSendMessage}
        />
        
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isStreaming={isStreaming}
          onStop={handleStopStreaming}
        />
      </div>
    </div>
  );
}
