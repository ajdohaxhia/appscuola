'use client';

import { useState } from 'react';
import { OpenAIService } from '@/app/lib/openai';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AIImageModule() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openAIService = new OpenAIService();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await openAIService.generateImage(prompt, {
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
        saveToDb: true
      });

      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
        <button
          onClick={handleGenerateImage}
          disabled={isLoading || !prompt.trim()}
          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="flex-1 flex items-center justify-center">
          <img
            src={generatedImage}
            alt="Generated image"
            className="max-w-full max-h-[60vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
} 