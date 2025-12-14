import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private apiKey: string = '';

  constructor() {
    // Initialized empty, waits for key injection
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    this.client = new GoogleGenAI({ apiKey: key });
  }

  public hasKey(): boolean {
    return !!this.client && !!this.apiKey;
  }

  public async generateResponse(
    model: string,
    history: Message[],
    systemInstruction: string
  ): Promise<string> {
    if (!this.client) {
      throw new Error("API Key not configured");
    }

    try {
      // Transform internal history to Gemini API format
      // Note: System instruction is passed in config
      // History should only contain user/model turns
      
      // We only take the last N messages to avoid token limits on free tier, 
      // though Gemini context window is large.
      const conversationHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // The last message is usually the new prompt, but in this architecture
      // we append the user message to history before calling service.
      // So we separate the history.
      
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      const previousHistory = conversationHistory.slice(0, -1);

      // We use chat interface for history awareness
      const chat = this.client.chats.create({
        model: model,
        history: previousHistory,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      // Send the last message
      const result: GenerateContentResponse = await chat.sendMessage({
        message: lastMessage.parts[0].text
      });
      
      return result.text || "I couldn't generate a response.";

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes('429')) {
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }
      throw new Error(error.message || "Failed to connect to Gemini API");
    }
  }
}

export const geminiService = new GeminiService();