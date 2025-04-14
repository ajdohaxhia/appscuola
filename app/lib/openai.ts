'use client';

import { dbService } from './db';
import type { AISession } from './db';

// Define the interfaces that were previously imported but missing
interface ChatHistory {
  id?: number;
  title: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

interface AIImage {
  id?: number;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
  model: string;
}

// Add this to the existing interface or create a new one for enhanced messages with attachments
export interface MessageContent {
  type: 'text' | 'image' | 'audio';
  text?: string;
  image_url?: string;
  audio_url?: string;
}

// Tipo per i messaggi di OpenAI
export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[]; // Can be string or array of content parts
}

// Tipo per la richiesta di chat
interface ChatRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Tipo per la richiesta di immagini
interface ImageRequest {
  prompt: string;
  model: string;
  n: number;
  size: string;
  quality?: string;
  style?: string;
}

// Tipo per la risposta di OpenAI
interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

// Tipo per la risposta di immagini
interface ImageResponse {
  created: number;
  data: {
    url: string;
  }[];
}

// Classe per gestire le chiamate all'API di OpenAI
export class OpenAIService {
  private imageModel = 'dall-e-3';

  constructor() {
    // No need to store API key in the client
  }

  /**
   * Check if API is available (we don't need to check for API key anymore)
   */
  hasApiKey(): boolean {
    return true; // Always return true as the key is managed server-side
  }

  /**
   * Fetch available chat models from our backend API
   */
  async getAvailableChatModels(): Promise<string[]> {
    try {
      const response = await fetch('/api/openai/models');
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to fetch models: ${response.statusText}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error fetching available models:', error);
      throw error;
    }
  }

  /**
   * Send a chat message to OpenAI API via our server-side route
   */
  async sendChatMessage(
    messages: OpenAIMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      saveHistory?: boolean;
      historyId?: number;
      historyTitle?: string;
      files?: File[];
    } = {}
  ): Promise<string> {
    try {
      // Process files if any
      let processedMessages = [...messages];
      if (options.files && options.files.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
          const contentArray: MessageContent[] = [];
          
          // Add text content if present
          if (typeof lastMessage.content === 'string' && lastMessage.content.trim()) {
            contentArray.push({
              type: 'text',
              text: lastMessage.content
            });
          }
          
          // Process files
          for (const file of options.files) {
            if (file.type.startsWith('image/')) {
              const imageUrl = await this.uploadAndGetImageUrl(file);
              if (imageUrl) {
                contentArray.push({
                  type: 'image',
                  image_url: imageUrl
                });
              }
            } else if (file.type.startsWith('audio/')) {
              const audioUrl = await this.uploadAndGetAudioUrl(file);
              if (audioUrl) {
                contentArray.push({
                  type: 'audio',
                  audio_url: audioUrl
                });
              }
            }
          }
          
          // Replace last message with processed content
          processedMessages = [
            ...messages.slice(0, -1),
            {
              ...lastMessage,
              content: contentArray
            }
          ];
        }
      }

      // Prepare request body
      const requestBody = {
        model: options.model || 'gpt-3.5-turbo',
        messages: processedMessages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
      };

      // Add retry logic
      let retries = 3;
      let lastError: Error | null = null;

      while (retries > 0) {
        try {
          console.log('Sending request to OpenAI API:', {
            model: requestBody.model,
            messageCount: requestBody.messages.length,
            retryAttempt: 4 - retries
          });

          const response = await fetch('/api/openai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            let errorMessage = `HTTP error ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
              console.error('API error response:', errorData);
            } catch (e) {
              const text = await response.text();
              console.error('Raw error response:', text);
              errorMessage = `HTTP error ${response.status}: ${text}`;
            }
            throw new Error(errorMessage);
          }

          const data = await response.json();
          
          if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from OpenAI API');
          }

          const reply = data.choices[0].message.content;

          // Save chat history if requested
          if (options.saveHistory) {
            try {
              await this.saveChatHistory(
                processedMessages,
                reply,
                options.historyId,
                options.historyTitle
              );
            } catch (error) {
              console.error('Error saving chat history:', error);
            }
          }

          return reply;
        } catch (error) {
          lastError = error as Error;
          console.error(`Attempt ${4 - retries} failed:`, error);
          retries--;
          
          if (retries === 0) {
            throw lastError;
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
        }
      }

      throw lastError || new Error('Failed to get response from OpenAI API');
    } catch (error) {
      console.error('Error in sendChatMessage:', error);
      throw error;
    }
  }

  /**
   * Generate a simple text completion from OpenAI
   */
  async generateCompletion(
    prompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    // Wrap the prompt in a chat message
    const messages: OpenAIMessage[] = [
      { role: 'user', content: prompt }
    ];
    
    return this.sendChatMessage(messages, options);
  }

  // Funzione per inviare prompt all'API di generazione immagini
  public async generateImage(
    prompt: string,
    options: {
      n?: number;
      size?: string;
      quality?: string;
      style?: string;
      saveToDb?: boolean;
    } = {}
  ): Promise<string> {
    const {
      n = 1,
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      saveToDb = true,
    } = options;

    try {
      const requestData = {
        prompt,
        model: this.imageModel,
        n,
        size,
        quality,
        style,
      };

      const response = await fetch('/api/openai/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nella richiesta API');
      }

      const data: ImageResponse = await response.json();
      const imageUrl = data.data[0]?.url || '';

      // Salva l'immagine nel database se richiesto
      if (saveToDb && imageUrl) {
        await this.saveGeneratedImage(prompt, imageUrl);
      }

      return imageUrl;
    } catch (error) {
      console.error('Errore OpenAI:', error);
      throw error;
    }
  }

  /**
   * Save chat history to database
   */
  private async saveChatHistory(
    messages: OpenAIMessage[],
    reply: string,
    historyId?: number,
    historyTitle: string = 'Nuova Conversazione'
  ): Promise<number> {
    try {
      const now = new Date();
      // Format messages in a way compatible with our database structure
      const formattedMessages = messages.map((msg) => ({
        role: msg.role === 'system' ? 'assistant' : msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
        timestamp: now,
      }));

      // Add the assistant's reply
      formattedMessages.push({
        role: 'assistant',
        content: reply,
        timestamp: now,
      });
      
      // If historyId is provided, update existing chat
      if (historyId) {
        try {
          const existingChat = await dbService.getNoteById(historyId) as unknown as AISession;
          if (existingChat) {
            const updatedChat = {
              ...existingChat,
              messages: formattedMessages,
              updatedAt: now,
            };
            await dbService.updateNote(updatedChat as any);
            return historyId;
          }
        } catch (error) {
          console.error('Error updating chat history:', error);
        }
      }

      // Create a new chat history entry as a Note
      const newChatHistory = {
        title: this.getMessageTitle(messages[0]) || historyTitle,
        content: JSON.stringify(formattedMessages), // Store messages as JSON in content field
        plainTextContent: this.getPlainTextContent(messages), // For search
        createdAt: now,
        updatedAt: now,
      };

      // Using notes table as storage for AI sessions
      return await dbService.addNote(newChatHistory);
    } catch (error) {
      console.error('Error saving chat history:', error);
      return -1;
    }
  }

  /**
   * Helper function to get plain text content from messages for search
   */
  private getPlainTextContent(messages: OpenAIMessage[]): string {
    return messages.map(message => {
      if (typeof message.content === 'string') {
        return message.content;
      } else if (Array.isArray(message.content)) {
        return message.content
          .filter(item => item.type === 'text' && item.text)
          .map(item => item.text)
          .join(' ');
      }
      return '';
    }).join(' ');
  }

  /**
   * Helper function to get a title from a message
   */
  private getMessageTitle(message: OpenAIMessage): string {
    if (typeof message.content === 'string') {
      return message.content.substring(0, 50);
    } else if (Array.isArray(message.content) && message.content.length > 0) {
      const textContent = message.content.find(item => item.type === 'text');
      if (textContent && textContent.text) {
        return textContent.text.substring(0, 50);
      }
      return 'Conversazione con allegati';
    }
    return 'Nuova Conversazione';
  }

  // Funzione per salvare l'immagine generata nel database
  private async saveGeneratedImage(prompt: string, imageUrl: string): Promise<number> {
    try {
      // Fetch the image to get dimensions
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const now = new Date();
      // Using UserImage type as a fallback
      const newImage = {
        filename: `ai-image-${Date.now()}.png`,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        mimeType: 'image/png',
        size: blob.size,
        width: 1024, // Default size for DALL-E
        height: 1024,
        title: prompt.slice(0, 100),
        description: prompt,
        tags: ['ai-generated'],
        uploadDate: now,
      };
      
      return await dbService.createImage(newImage);
    } catch (error) {
      console.error('Error saving image to database:', error);
      return -1;
    }
  }

  // Add new methods to handle file uploads

  /**
   * Upload an image file and return a URL that can be used in the OpenAI API
   */
  private async uploadAndGetImageUrl(file: File): Promise<string | null> {
    try {
      // First, convert the file to a data URL
      const dataUrl = await this.fileToDataUrl(file);
      
      // Then, store it and get a URL that can be referenced
      return dataUrl; // For now, we'll just use the data URL directly
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  /**
   * Upload an audio file and return a URL that can be used in the OpenAI API
   */
  private async uploadAndGetAudioUrl(file: File): Promise<string | null> {
    try {
      // First, convert the file to a data URL
      const dataUrl = await this.fileToDataUrl(file);
      
      // Then, store it and get a URL that can be referenced
      return dataUrl; // For now, we'll just use the data URL directly
    } catch (error) {
      console.error('Error uploading audio:', error);
      return null;
    }
  }

  /**
   * Convert a file to a data URL
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Istanza del servizio OpenAI
export const openaiService = new OpenAIService(); 