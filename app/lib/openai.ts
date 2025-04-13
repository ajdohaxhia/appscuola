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

// Tipo per i messaggi di OpenAI
interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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
    } = {}
  ): Promise<string> {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 500,
      saveHistory = true,
      historyId,
      historyTitle = 'Nuova Conversazione',
    } = options;

    try {
      const requestData = {
        messages,
        temperature,
        max_tokens: maxTokens,
        model,
      };

      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `HTTP error ${response.status}`;
        throw new Error(`OpenAI API Error: ${errorMessage}`);
      }

      const data: ChatResponse = await response.json();
      const reply = data.choices[0]?.message.content || '';

      // Salva la conversazione nel database se richiesto
      if (saveHistory) {
        await this.saveChatHistory(messages, reply, historyId, historyTitle);
      }

      return reply;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while communicating with OpenAI API');
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

  // Funzione per salvare la conversazione nel database
  private async saveChatHistory(
    messages: OpenAIMessage[],
    reply: string,
    historyId?: number,
    historyTitle?: string
  ): Promise<number> {
    const now = new Date();
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === 'system' ? 'assistant' : msg.role,
      content: msg.content,
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

    // Create new chat history
    const newChatHistory = {
      title: historyTitle || messages[0]?.content.slice(0, 50) || 'Nuova Conversazione',
      content: JSON.stringify(formattedMessages), // Store messages as JSON in content field
      plainTextContent: messages.map(m => m.content).join(' '), // For search
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Using notes table as a fallback for AI sessions
      return await dbService.addNote(newChatHistory);
    } catch (error) {
      console.error('Error saving chat history:', error);
      return -1;
    }
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
}

// Istanza del servizio OpenAI
export const openaiService = new OpenAIService(); 