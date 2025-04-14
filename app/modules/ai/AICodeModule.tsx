'use client';

import { useState } from 'react';
import { OpenAIService } from '@/app/lib/openai';
import { Code, Loader2 } from 'lucide-react';

interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export default function AICodeModule() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<CodeExample | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openAIService = new OpenAIService();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await openAIService.sendChatMessage(
        [
          {
            role: 'system',
            content: 'You are a helpful coding assistant. Generate code examples with explanations.'
          },
          {
            role: 'user',
            content: `Generate a code example for: ${prompt}. Include the programming language, the code, and a brief explanation.`
          }
        ],
        {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      // Parse the response to extract code and explanation
      const codeMatch = response.match(/```(\w+)?\n([\s\S]*?)```/);
      const explanationMatch = response.match(/Explanation:\s*([\s\S]*?)(?=\n\n|$)/);

      if (codeMatch && explanationMatch) {
        setGeneratedCode({
          language: codeMatch[1] || 'plaintext',
          code: codeMatch[2].trim(),
          explanation: explanationMatch[1].trim()
        });
      } else {
        throw new Error('Could not parse code and explanation from response');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      setError('Failed to generate code. Please try again.');
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
          placeholder="Describe the code you want to generate..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
        />
        <button
          onClick={handleGenerateCode}
          disabled={isLoading || !prompt.trim()}
          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Code className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {generatedCode && (
        <div className="flex-1 space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-gray-500">
                {generatedCode.language}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode.code)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Copy
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {generatedCode.code}
            </pre>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Explanation</h3>
            <p className="text-sm">{generatedCode.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
} 