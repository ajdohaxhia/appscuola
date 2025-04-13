'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Send, Settings, X, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { OpenAIService } from '@/app/lib/openai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function AIChatModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // State for model selection
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo'); // Default model
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);
  const [modelsError, setModelsError] = useState<string | null>(null);

  // Initialize OpenAI service
  const openAIService = useRef(new OpenAIService());

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const models = await openAIService.current.getAvailableChatModels();
        if (models && models.length > 0) {
          setAvailableModels(models);
          // Set default model (e.g., gpt-4o if available, else gpt-3.5-turbo, else first model)
          const preferredModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
          let defaultModel = models[0]; // Fallback to the first model
          for (const prefModel of preferredModels) {
            if (models.includes(prefModel)) {
              defaultModel = prefModel;
              break;
            }
          }
          setSelectedModel(defaultModel);
        } else {
          setModelsError('Nessun modello AI trovato.');
          setAvailableModels([]);
          setSelectedModel(''); // No models, clear selection
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
        setModelsError(err instanceof Error ? err.message : 'Impossibile caricare i modelli AI.');
        setAvailableModels([]);
        setSelectedModel('');
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || modelsLoading || !selectedModel) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);
    
    try {
      const newMessages = [...messages, userMessage];
      const reply = await openAIService.current.sendChatMessage(newMessages, {
        model: selectedModel, // Pass the selected model
        saveHistory: true,
        historyTitle: input.slice(0, 50) // Use first 50 chars of the first message as title
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la comunicazione con OpenAI.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* Header with Model Selector */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Assistant</h2>
        <div className="relative">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={modelsLoading || modelsError !== null || availableModels.length === 0}
            className="pl-3 pr-8 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Seleziona modello AI"
          >
            {modelsLoading ? (
              <option value="" disabled>Caricamento modelli...</option>
            ) : modelsError ? (
              <option value="" disabled>Errore caricamento</option>
            ) : availableModels.length === 0 ? (
              <option value="" disabled>Nessun modello</option>
            ) : (
              availableModels.map(modelId => (
                <option key={modelId} value={modelId}>
                  {modelId}
                </option>
              ))
            )}
          </select>
          <ChevronDown 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          />
          {modelsLoading && (
            <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>
      {modelsError && (
          <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs flex items-center">
            <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
            {modelsError}
          </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center max-w-md">
              Benvenuto! Seleziona un modello AI e poni una domanda.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Define conditional classes
              const outerDivClass = 'mb-4' + (message.role === 'user' ? ' ml-auto' : '');
              const innerDivClass = 'max-w-[80%] p-3 rounded-lg ' + 
                (message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200');

              return (
                <div
                  key={index}
                  className={outerDivClass}
                >
                  <div
                    className={innerDivClass}
                  >
                    <div className="flex justify-between items-start">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Copia"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500 dark:text-gray-400" />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">L'assistente sta pensando...</span>
          </div>
        )}
        
        {error && !modelsError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {isCopied && (
          <div className="fixed bottom-20 right-4 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg text-sm">
            Copiato negli appunti!
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md resize-none overflow-hidden max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 dark:bg-gray-700"
            placeholder="Scrivi un messaggio..."
            rows={1}
            disabled={modelsLoading || modelsError !== null || !selectedModel}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || modelsLoading || modelsError !== null || !input.trim() || !selectedModel}
            className={`p-2 rounded-r-md ${
              isLoading || modelsLoading || modelsError !== null || !input.trim() || !selectedModel
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title={!selectedModel ? "Seleziona prima un modello AI" : "Invia messaggio"}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} 