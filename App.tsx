import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { geminiService } from './services/geminiService';
import { LOCAL_STORAGE_KEY, PERSONAS, DEFAULT_MODEL } from './constants';
import { Message, Persona, StoredConfig } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>(Persona.ASSISTANT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load config on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const config: StoredConfig = JSON.parse(stored);
      if (config.apiKey) {
        setApiKey(config.apiKey);
        geminiService.setApiKey(config.apiKey);
      } else {
        setIsModalOpen(true);
      }
      if (config.selectedPersona) {
        setPersona(config.selectedPersona);
      }
    } else {
      setIsModalOpen(true);
    }
  }, []);

  // Persist persona changes
  useEffect(() => {
    if (apiKey) {
      const config: StoredConfig = { apiKey, selectedPersona: persona };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    }
  }, [persona, apiKey]);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    geminiService.setApiKey(key);
    const config: StoredConfig = { apiKey: key, selectedPersona: persona };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    setIsModalOpen(false);
  };

  const handleResetKey = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setApiKey(null);
    setMessages([]);
    setIsModalOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const responseText = await geminiService.generateResponse(
        DEFAULT_MODEL,
        newMessages,
        PERSONAS[persona].systemPrompt
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `**Error**: ${error.message || 'Something went wrong.'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-background text-slate-100 overflow-hidden">
      <ApiKeyModal isOpen={isModalOpen} onSave={handleSaveKey} />
      
      <Sidebar 
        currentPersona={persona}
        onSelectPersona={setPersona}
        onClearChat={handleClearChat}
        onResetKey={handleResetKey}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header Toggle */}
        <div className="md:hidden absolute top-4 left-4 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-surface border border-slate-700 rounded-lg shadow-lg text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <ChatInterface 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          currentPersona={persona}
        />
      </div>
    </div>
  );
}

export default App;