'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { type Flashcard, type FlashcardSet } from '@/app/lib/db';
import { X, Check, BookOpen, ArrowLeft, RotateCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface FlashcardStudyProps {
  set: FlashcardSet;
  initialFlashcards: Flashcard[];
  onUpdateFlashcard: (card: Flashcard) => void;
  onEndStudy: () => void;
  isLoading: boolean;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({
  set,
  initialFlashcards,
  onUpdateFlashcard,
  onEndStudy,
  isLoading
}) => {
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [studyComplete, setStudyComplete] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    reviewedCards: 0,
    correctAnswers: 0
  });
  const [sessionComplete, setSessionComplete] = useState(false);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const now = new Date();
    const due = initialFlashcards.filter((card: Flashcard) => 
        !card.dueDate || new Date(card.dueDate) <= now
    );
    setDueCards(due);
    setStats((prev) => ({ ...prev, totalCards: due.length }));
    setLoadingInitial(false);
  }, [initialFlashcards]);

  const currentCard = useMemo(() => {
    if (loadingInitial || dueCards.length === 0 || currentCardIndex >= dueCards.length) {
      return null;
    }
    return dueCards[currentCardIndex];
  }, [currentCardIndex, dueCards, loadingInitial]);

  const processAnswer = (quality: number) => {
    if (!currentCard) return;

    setIsFlipped(false);
    
    const newRepetitions = quality >= 3 ? (currentCard.repetitions || 0) + 1 : 0;
    let newEaseFactor = (currentCard.easeFactor || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newInterval: number;
    if (newRepetitions <= 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      const currentInterval = typeof currentCard.interval === 'number' && !isNaN(currentCard.interval) ? currentCard.interval : 0;
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
    
    newInterval = Math.max(1, newInterval);

    const now = new Date();
    const nextDueDate = new Date(now);
    nextDueDate.setDate(nextDueDate.getDate() + newInterval);

    const updatedCard: Flashcard = {
      ...currentCard,
      repetitions: newRepetitions,
      easeFactor: newEaseFactor,
      interval: newInterval,
      dueDate: nextDueDate,
      lastReviewed: now
    };

    onUpdateFlashcard(updatedCard);

    setStats((prev) => ({
      ...prev,
      reviewedCards: prev.reviewedCards + 1,
      correctAnswers: quality >= 3 ? prev.correctAnswers + 1 : prev.correctAnswers
    }));

    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setSessionComplete(true);
      setTimeout(() => {
        onEndStudy();
      }, 5000);
    }
  };

  const resetStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyComplete(false);
    setStats({
      totalCards: dueCards.length,
      reviewedCards: 0,
      correctAnswers: 0
    });
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <BookOpen size={64} className="mb-4 text-primary-dark dark:text-primary-light" />
        <h2 className="text-2xl font-bold mb-2">Nessuna scheda da rivedere</h2>
        <p className="mb-6">Tutte le schede in questo mazzo sono state ripassate. Torna più tardi!</p>
        <button
          onClick={onEndStudy}
          className="flex items-center px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md"
        >
          <ArrowLeft size={18} className="mr-2" />
          Torna al mazzo
        </button>
      </div>
    );
  }

  if (sessionComplete) {
    const percentCorrect = stats.reviewedCards > 0 
      ? Math.round((stats.correctAnswers / stats.reviewedCards) * 100) 
      : 0;
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Confetti width={width} height={height} recycle={false} numberOfPieces={200}/>
        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Sessione Completata!</h2>
        <p className="text-lg mb-2 text-gray-700 dark:text-gray-300">Ottimo lavoro!</p>
        <p className="text-gray-600 dark:text-gray-400">Corrette: {stats.correctAnswers} / {stats.totalCards}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sbagliate: {stats.totalCards - stats.correctAnswers} / {stats.totalCards}</p>
        <button
          onClick={onEndStudy}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-150 ease-in-out"
        >
          Torna al Set
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Studio: {set.title}</h2>
        <div className="flex items-center">
          <span className="mr-4 text-gray-600 dark:text-gray-300">
            {currentCardIndex + 1} di {dueCards.length}
          </span>
          <button
            onClick={onEndStudy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      {currentCard && (
        <div className="flex-1 flex flex-col">
          <div 
            className="flex-1 flex items-center justify-center mb-8 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300">
              <div className="text-center mb-2 text-sm text-gray-500">
                {isFlipped ? 'Risposta' : 'Domanda'}
              </div>
              <div className="text-xl font-medium">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              
              {!isFlipped && (
                <div className="mt-6 text-center text-sm text-gray-500">
                  Clicca per vedere la risposta
                </div>
              )}
            </div>
          </div>
          
          {isFlipped && (
            <div className="mb-6">
              <div className="text-center mb-4 text-gray-600 dark:text-gray-300">
                Quanto bene conoscevi questa risposta?
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => processAnswer(1)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Non la sapevo
                </button>
                <button
                  onClick={() => processAnswer(3)}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                >
                  Con difficoltà
                </button>
                <button
                  onClick={() => processAnswer(5)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  La sapevo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardStudy; 