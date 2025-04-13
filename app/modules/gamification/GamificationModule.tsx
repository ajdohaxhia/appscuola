'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Target, Calendar, Flame, Zap, Star, CheckCircle, Medal, ArrowUp } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import Confetti from 'react-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  progress?: {
    current: number;
    total: number;
  };
  category: 'daily' | 'weekly' | 'milestone' | 'special';
  date?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  acquired: boolean;
  level: number;
  maxLevel: number;
}

export function GamificationModule() {
  const [currentPoints, setCurrentPoints] = useState(120);
  const [level, setLevel] = useState(3);
  const [nextLevelPoints, setNextLevelPoints] = useState(200);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isNewAchievement, setIsNewAchievement] = useState(false);
  
  // Daily streak data
  const [streak, setStreak] = useState(3);
  const [longestStreak, setLongestStreak] = useState(5);
  
  // Animations
  const pointsProps = useSpring({ 
    points: currentPoints, 
    from: { points: 0 },
    config: { tension: 120, friction: 14 }
  });
  
  const progressProps = useSpring({
    width: `${(currentPoints / nextLevelPoints) * 100}%`,
    from: { width: '0%' },
    config: { tension: 120, friction: 14 }
  });
  
  useEffect(() => {
    // Simulate new achievement for demonstration purposes
    setTimeout(() => {
      setIsNewAchievement(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  }, []);
  
  const achievements: Achievement[] = [
    {
      id: 'streak-3',
      title: 'Streak di 3 giorni',
      description: 'Hai studiato per 3 giorni consecutivi!',
      icon: <Flame className="h-6 w-6 text-orange-400" />,
      points: 15,
      completed: true,
      category: 'daily',
      date: '20/06/2023'
    },
    {
      id: 'flashcards-5',
      title: 'Flashcards Master',
      description: 'Hai completato 5 set di flashcards',
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      points: 10,
      completed: true,
      category: 'milestone',
      date: '19/06/2023'
    },
    {
      id: 'maps-3',
      title: 'Creazione Mappe',
      description: 'Crea 3 mappe mentali',
      icon: <Target className="h-6 w-6 text-blue-400" />,
      points: 20,
      completed: false,
      progress: {
        current: 2,
        total: 3
      },
      category: 'weekly'
    },
    {
      id: 'note-10',
      title: 'Note Expert',
      description: 'Scrivi 10 note dettagliate',
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      points: 25,
      completed: false,
      progress: {
        current: 7,
        total: 10
      },
      category: 'milestone'
    },
    {
      id: 'login-7',
      title: 'Utente Assiduo',
      description: 'Accedi 7 giorni in una settimana',
      icon: <Calendar className="h-6 w-6 text-purple-400" />,
      points: 15,
      completed: false,
      progress: {
        current: 5,
        total: 7
      },
      category: 'weekly'
    }
  ];
  
  const badges: Badge[] = [
    {
      id: 'note-master',
      name: 'Note Master',
      description: 'Esperto nella creazione di note',
      image: '🏆',
      acquired: true,
      level: 2,
      maxLevel: 3
    },
    {
      id: 'flashcard-pro',
      name: 'Flashcard Pro',
      description: 'Professionista delle flashcard',
      image: '⚡',
      acquired: true,
      level: 1,
      maxLevel: 3
    },
    {
      id: 'ai-explorer',
      name: 'AI Explorer',
      description: 'Esploratore delle funzionalità AI',
      image: '🤖',
      acquired: false,
      level: 0,
      maxLevel: 3
    },
    {
      id: 'consistent-learner',
      name: 'Consistent Learner',
      description: 'Studente costante con lunghi streak',
      image: '🔥',
      acquired: true,
      level: 2,
      maxLevel: 5
    }
  ];
  
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);
  
  return (
    <div className="bg-white dark:bg-gray-900 min-h-full py-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-primary dark:text-primary-light">Gamification</h1>
        
        {/* Level and Points Display */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Livello {level}</h2>
              <p className="text-3xl font-bold">
                {Math.floor(pointsProps.points.get())} punti
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">
                  <Flame className="inline-block h-4 w-4 mr-1" />
                  Streak: {streak} giorni
                </span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">
                  <Award className="inline-block h-4 w-4 mr-1" />
                  Miglior streak: {longestStreak}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden mb-2">
            <animated.div className="bg-white h-full rounded-full" style={progressProps} />
          </div>
          
          <div className="flex justify-between text-xs">
            <span>Livello {level}</span>
            <span>{currentPoints}/{nextLevelPoints} per Livello {level + 1}</span>
          </div>
        </div>
        
        {/* Badges Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">I tuoi Badge</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center transition-transform hover:scale-105 ${
                  !badge.acquired ? 'opacity-50' : ''
                }`}
              >
                <div className="text-4xl mb-2">{badge.image}</div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">{badge.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{badge.description}</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(badge.maxLevel)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full ${
                        i < badge.level ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  Livello {badge.level}/{badge.maxLevel}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Obiettivi</h2>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Tutti
              </button>
              <button 
                onClick={() => setSelectedCategory('daily')}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === 'daily'
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Giornalieri
              </button>
              <button 
                onClick={() => setSelectedCategory('weekly')}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === 'weekly'
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Settimanali
              </button>
              <button 
                onClick={() => setSelectedCategory('milestone')}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedCategory === 'milestone'
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Milestone
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all ${
                  achievement.id === 'streak-3' && isNewAchievement 
                    ? 'bg-blue-50 dark:bg-blue-900/20 animate-pulse' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-4">
                    {achievement.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 dark:text-gray-200">{achievement.title}</h3>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-yellow-500 font-medium">+{achievement.points} pts</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{achievement.description}</p>
                    
                    {achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progresso</span>
                          <span>{achievement.progress.current}/{achievement.progress.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {achievement.completed && achievement.date && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>Completato il {achievement.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamificationModule; 