import React from 'react';
import { Bot, Code2, Briefcase, PenTool, Settings, LogOut, Trash2, X } from 'lucide-react';
import { Persona, PersonaConfig } from '../types';
import { PERSONAS } from '../constants';

interface SidebarProps {
  currentPersona: Persona;
  onSelectPersona: (p: Persona) => void;
  onClearChat: () => void;
  onResetKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPersona,
  onSelectPersona,
  onClearChat,
  onResetKey,
  isOpen,
  onClose
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-surface border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2 pt-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
               <div className="bg-gradient-to-tr from-primary to-accent w-8 h-8 rounded-lg flex items-center justify-center">
                 <Bot className="w-5 h-5 text-white" />
               </div>
               Gemini Agent
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Personas</h3>
            {(Object.values(PERSONAS) as PersonaConfig[]).map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  onSelectPersona(persona.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  currentPersona === persona.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {getIcon(persona.icon)}
                <div className="text-left">
                  <div className="font-medium text-sm">{persona.name}</div>
                  <div className="text-[10px] opacity-70 truncate max-w-[140px]">{persona.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-2 border-t border-slate-700/50 pt-4">
            <button
              onClick={onClearChat}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear Conversation
            </button>
            <button
              onClick={onResetKey}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              Update API Key
            </button>
          </div>
        </div>
      </div>
    </>
  );
};