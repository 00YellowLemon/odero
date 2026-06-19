export interface ToolCall {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
}
