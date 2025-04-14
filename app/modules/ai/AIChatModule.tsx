'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Send, Settings, X, AlertCircle, Loader2, ChevronDown, Paperclip, Mic, Image as ImageIcon, StopCircle } from 'lucide-react';
import { OpenAIService, MessageContent } from '@/app/lib/openai';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
  files?: File[]; // Added to track attached files
}

export function AIChatModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // State for file handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  
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
  
  // Cleanup recording resources on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  const handleSendMessage = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading || modelsLoading || !selectedModel) return;
    
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      files: selectedFiles.length > 0 ? [...selectedFiles] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedFiles([]);
    setError(null);
    setIsLoading(true);
    
    try {
      const newMessages = [...messages, userMessage];
      // Convert our messages format to OpenAI format
      const openAIMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const reply = await openAIService.current.sendChatMessage(openAIMessages, {
        model: selectedModel,
        saveHistory: true,
        historyTitle: typeof newMessages[0].content === 'string' 
          ? newMessages[0].content.slice(0, 50) 
          : 'Conversazione con file',
        files: userMessage.files // Pass attached files
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
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.wav`, { type: 'audio/wav' });
        setSelectedFiles(prev => [...prev, audioFile]);
        setIsRecording(false);
        if (recordingTimerRef.current) {
          window.clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecordingTime(0);
        
        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start a timer to display recording duration
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Impossibile accedere al microfono. Verifica le autorizzazioni del browser.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Render message content (text, images, audio)
  const renderMessageContent = (content: string | MessageContent[]) => {
    if (typeof content === 'string') {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    return (
      <div>
        {content.map((item, i) => {
          if (item.type === 'text' && item.text) {
            return <div key={i} className="whitespace-pre-wrap mb-2">{item.text}</div>;
          } else if (item.type === 'image' && item.image_url) {
            return (
              <div key={i} className="my-2">
                <img 
                  src={item.image_url} 
                  alt="Immagine allegata" 
                  className="max-w-full rounded-lg max-h-80 object-contain"
                />
              </div>
            );
          } else if (item.type === 'audio' && item.audio_url) {
            return (
              <div key={i} className="my-2">
                <audio controls className="w-full">
                  <source src={item.audio_url} type="audio/wav" />
                  Il tuo browser non supporta l'elemento audio.
                </audio>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
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
              Benvenuto! Seleziona un modello AI e poni una domanda. Puoi anche allegare immagini o registrare messaggi vocali.
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
                      <div className="w-full">
                        {renderMessageContent(message.content)}
                      </div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(typeof message.content === 'string' ? message.content : 'Impossibile copiare contenuto con allegati')}
                          className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
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
      
      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative rounded-md border border-gray-300 dark:border-gray-600 p-1">
                {file.type.startsWith('image/') ? (
                  <div className="relative h-12 w-12">
                    <Image 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : file.type.startsWith('audio/') ? (
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                    <Mic className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                    <Paperclip className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
                <button 
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                  title="Rimuovi file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Voice recording indicator */}
      {isRecording && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-700 dark:text-red-300 text-sm">
                Registrazione in corso... {formatRecordingTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
              title="Interrompi registrazione"
            >
              <StopCircle size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        accept="image/*,audio/*" 
        multiple 
      />
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col">
          <div className="flex mb-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md resize-none overflow-hidden max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 dark:bg-gray-700"
              placeholder="Scrivi un messaggio..."
              rows={1}
              disabled={modelsLoading || modelsError !== null || !selectedModel || isRecording}
            />
            <div className="flex">
              <button
                onClick={handleSendMessage}
                disabled={isLoading || modelsLoading || modelsError !== null || (!input.trim() && selectedFiles.length === 0) || !selectedModel || isRecording}
                className={`p-2 ${
                  isLoading || modelsLoading || modelsError !== null || (!input.trim() && selectedFiles.length === 0) || !selectedModel || isRecording
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } rounded-r-md`}
                title={!selectedModel ? "Seleziona prima un modello AI" : "Invia messaggio"}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          {/* Attachment buttons */}
          <div className="flex gap-2">
            {/* Image attachment button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isRecording}
              className={`p-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 ${
                isLoading || isRecording ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Allega immagine"
            >
              <ImageIcon size={18} />
            </button>
            
            {/* Voice recording button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`p-1.5 border rounded-md ${
                isRecording 
                  ? 'border-red-500 bg-red-100 dark:bg-red-900/20 text-red-500' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={isRecording ? "Interrompi registrazione" : "Registra messaggio vocale"}
            >
              {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 