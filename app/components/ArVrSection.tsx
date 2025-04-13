'use client';

import React, { useState } from 'react';
import { Paintbrush, Trophy, Award, BadgeCheck, Target } from 'lucide-react';
import Link from 'next/link';

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
}

const FeatureBox = ({ icon, title, description, children, iconBgClass, iconTextClass }: FeatureBoxProps) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className={`${iconBgClass} p-3 rounded-full mr-4`}>
          <span className={iconTextClass}>{icon}</span>
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      {children || (
        <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-4 text-center h-48 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Presto disponibile</span>
        </div>
      )}
    </div>
  );
};

// Fake 3D model viewer component
const ARModelViewer = () => {
  return (
    <div className="relative h-60 bg-gray-800 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-primary/70 animate-pulse rounded-lg transform rotate-45" />
        <div className="w-32 h-32 bg-primary-light/50 animate-ping absolute rounded-full" />
      </div>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button className="bg-white/20 p-2 rounded-full hover:bg-white/30">
          <Paintbrush className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
          AR Demo
        </span>
      </div>
    </div>
  );
};

// Gamification component with achievements
const GamificationDemo = () => {
  const [points, setPoints] = useState(120);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <span className="text-white font-bold">{points} pts</span>
        </div>
        <div className="bg-primary/20 px-3 py-1 rounded-full">
          <span className="text-xs text-primary-light">Livello 3</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
          <div className="flex items-center space-x-2">
            <BadgeCheck className="h-5 w-5 text-green-400" />
            <span className="text-gray-200 text-sm">Completato 5 flashcards</span>
          </div>
          <span className="text-xs text-gray-400">+10 pts</span>
        </div>
        
        <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-400" />
            <span className="text-gray-200 text-sm">Streak di 3 giorni</span>
          </div>
          <span className="text-xs text-gray-400">+15 pts</span>
        </div>
        
        <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-400" />
            <span className="text-gray-200 text-sm">Obiettivo: crea 3 mappe</span>
          </div>
          <span className="text-xs text-white bg-primary/30 px-2 rounded">2/3</span>
        </div>
      </div>
    </div>
  );
};

const ArVrSection = () => {
  return (
    <section id="ar-vr" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light">AR/VR & Gamification</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Esperienze immersive per un apprendimento ancora più coinvolgente e motivante.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FeatureBox 
            icon={<Paintbrush className="w-8 h-8" />}
            title="Realtà Aumentata"
            description="Visualizza modelli 3D e concetti complessi direttamente nel tuo ambiente reale per una comprensione più profonda."
            iconBgClass="bg-purple-100 dark:bg-purple-900"
            iconTextClass="text-primary dark:text-primary-light"
          >
            <ARModelViewer />
          </FeatureBox>
          
          <FeatureBox 
            icon={<Trophy className="w-8 h-8" />}
            title="Gamification"
            description="Trasforma lo studio in un gioco con livelli, premi e sfide per mantenere alta la motivazione."
            iconBgClass="bg-blue-100 dark:bg-blue-900"
            iconTextClass="text-blue-600 dark:text-blue-300"
          >
            <GamificationDemo />
          </FeatureBox>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/dashboard" className="inline-block bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-full transition duration-300">
            Esplora funzionalità
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArVrSection; 