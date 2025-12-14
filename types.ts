export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export enum Persona {
  ASSISTANT = 'ASSISTANT',
  PROGRAMMER = 'PROGRAMMER',
  BUSINESS = 'BUSINESS',
  CREATOR = 'CREATOR'
}

export interface PersonaConfig {
  id: Persona;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  persona: Persona;
}

export interface StoredConfig {
  apiKey: string;
  selectedPersona: Persona;
}