import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AISuggestionsProps {
  onSuggestionSelect: (suggestion: string) => void;
  context?: string;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  onSuggestionSelect,
  context,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Here you would call your AI service
      // For now, we'll use mock data
      const mockSuggestions = [
        'Related Concept 1',
        'Related Concept 2',
        'Related Concept 3',
        'Related Concept 4',
        'Related Concept 5',
      ];
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={fetchSuggestions}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Get AI Suggestions
      </Button>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => onSuggestionSelect(suggestion)}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}; 