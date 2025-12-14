import React, { useState } from 'react';
import { Key, Lock, ExternalLink, AlertTriangle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.length < 30) {
      setError('Invalid API Key format');
      return;
    }
    onSave(inputKey);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-slate-700 rounded-xl max-w-md w-full shadow-2xl animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white">Setup Gemini API</h2>
          </div>

          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            To use this AI Agent, you need a free API key from Google AI Studio. 
            Your key is stored locally in your browser and never sent to any backend server.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 ml-1">
                API KEY
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setError('');
                  }}
                  placeholder="Paste your AI Studio Key here"
                  className="w-full bg-background border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!inputKey}
              className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Start Chatting
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <div className="flex items-start gap-3 bg-yellow-500/10 p-3 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/80">
                   This app requires a valid Gemini API key. It uses the "Free of Charge" tier by default.
                </p>
            </div>
            
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group p-3 rounded-lg hover:bg-slate-700/50 transition-colors border border-dashed border-slate-700 hover:border-slate-600"
            >
              <span className="text-sm text-slate-300">Get your free API Key</span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};