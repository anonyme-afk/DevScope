import { t } from '../i18n';
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, RefreshCw } from 'lucide-react';
import { DeveloperIntelligence } from '../types';

interface AiAssistantTabProps {
  intelligence: DeveloperIntelligence;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'Quel est son projet le plus techniquement complexe et pourquoi ?',
  'Est-il prêt pour un poste de Staff / Lead Engineer ? Évalue son autonomie.',
  'Rédige une synthèse de ses compétences à présenter à notre CTO.',
  'Quelles questions pièges lui poser sur l\'architecture de ses dépôts ?',
];

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({ intelligence }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'model',
      text: `Bonjour ! Je suis l'assistant d'ingénierie DevScope AI. J'ai analysé en détail tous les dépôts, READMEs et compétences de **${
        intelligence.user.name || intelligence.user.login
      }**. Posez-moi n'importe quelle question sur son profil, sa stack, son architecture ou son adéquation avec votre équipe !`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          developerContext: intelligence,
          conversationHistory: messages.slice(1), // omit greeting
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réponse du serveur');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: data.response || "Désolé, je n'ai pas pu formuler de réponse.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'model',
        text: `Une erreur est survenue : ${err.message || 'Impossible de contacter l\'assistant.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-500 p-0.5 shadow-md shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <Bot className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t('recruitment.title')}</span>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.2 font-mono text-[10px] text-blue-300">
                Gemini 3.7
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Contextualisé sur le profil de @{intelligence.user.login} ({intelligence.projectAnalyses.length} projets audités)
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'init-reset',
                sender: 'model',
                text: `Conversation réinitialisée pour @${intelligence.user.login}. Posez votre question !`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          title="Réinitialiser le chat"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Effacer</span>
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'model' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/10'
                  : 'border border-zinc-800 bg-zinc-950/80 text-zinc-200 shadow-md whitespace-pre-line'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`mt-1.5 text-[10px] font-mono ${
                  msg.sender === 'user' ? 'text-blue-100/70 text-right' : 'text-zinc-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              <span>Analyse et réflexion en cours...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 mb-1.5">
          <Lightbulb className="h-3 w-3 text-amber-400" />
          <span>Suggestions de questions rapides :</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-blue-500/40 hover:text-white disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-800 bg-zinc-950 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Posez une question sur @${intelligence.user.login} ou ses projets...`}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-400 hover:to-sky-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
