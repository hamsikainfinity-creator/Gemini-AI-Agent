import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-surface text-slate-200 rounded-bl-none border border-slate-700/50'
        }`}
      >
        <div className={`markdown-content text-sm md:text-base leading-relaxed break-words ${isUser ? 'text-white' : 'text-slate-200'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className={`text-[10px] mt-2 opacity-60 ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      )}
    </div>
  );
};