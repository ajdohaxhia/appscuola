'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Send, Settings, X, AlertCircle, Loader2, ChevronDown, Paperclip, Mic, Image as ImageIcon, StopCircle, FileText } from 'lucide-react';
import { OpenAIService, MessageContent, OpenAIMessage } from '@/app/lib/openai';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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
  const [availableModels, setAvailableModels] = useState<{
    chat: string[];
    image: string[];
    document: string[];
  }>({ chat: [], image: [], document: [] });
  const [selectedModel, setSelectedModel] = useState<string>('gpt-3.5-turbo'); // Default model
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);
  const [modelsError, setModelsError] = useState<string | null>(null);

  // Initialize OpenAI service
  const openAIService = new OpenAIService();

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const models = await openAIService.getAvailableModels();
        if (models) {
          setAvailableModels(models);
          // Set default model (e.g., gpt-4o if available, else gpt-3.5-turbo, else first model)
          const preferredModels = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];
          let defaultModel = models.chat[0]; // Fallback to the first model
          for (const prefModel of preferredModels) {
            if (models.chat.includes(prefModel)) {
              defaultModel = prefModel;
              break;
            }
          }
          setSelectedModel(defaultModel);
        } else {
          setModelsError('Nessun modello AI trovato.');
          setAvailableModels({ chat: [], image: [], document: [] });
          setSelectedModel(''); // No models, clear selection
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
        setModelsError(err instanceof Error ? err.message : 'Impossibile caricare i modelli AI.');
        setAvailableModels({ chat: [], image: [], document: [] });
        setSelectedModel('');
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

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
      const openAIMessages: OpenAIMessage[] = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: input,
        },
      ];
      
      const reply = await openAIService.sendChatMessage(openAIMessages, {
        model: selectedModel,
        files: selectedFiles,
        saveHistory: true,
        historyTitle: typeof input === 'string' ? input.slice(0, 50) : 'Conversazione con file',
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
    <Card className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col h-[600px]">
        <div className="flex items-center gap-2 mb-4">
          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.chat.map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="space-y-2">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-background p-2 rounded-md"
                >
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
              accept="image/*,.pdf,.txt,.doc,.docx"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 