'use client';

import React from 'react';
import { FileText, Brain, Files, FlaskConical } from 'lucide-react';
import Link from 'next/link';

// Componente per la card delle funzionalità
const FeatureCard = ({ icon, title, description, placeholder, iconBgClass, placeholderTextClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-transform duration-300 hover:scale-105">
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${iconBgClass}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <div className={`h-32 flex items-center justify-center border-2 border-dashed rounded-lg ${placeholderTextClass} border-opacity-30 text-opacity-60`}>
      {placeholder}
    </div>
  </div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light">Le Nostre Funzionalità</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Strumenti avanzati progettati per ottimizzare il tuo apprendimento e migliorare i tuoi risultati accademici.</p>
          <Link 
            href="/dashboard" 
            className="inline-block mt-8 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg"
          >
            Prova tutte le funzionalità
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/dashboard?view=notes">
            <FeatureCard 
              icon={<FileText className="w-8 h-8" />} 
              title="Appunti Digitali" 
              description="Organizza e sincronizza i tuoi appunti tra tutti i dispositivi con un editor avanzato."
              placeholder="Editor di testo avanzato"
              iconBgClass="bg-purple-100 dark:bg-purple-900 text-primary dark:text-primary-light"
              placeholderTextClass="text-primary dark:text-primary-light"
            />
          </Link>
          
          <Link href="/dashboard?view=mindmaps">
            <FeatureCard 
              icon={<Brain className="w-8 h-8" />} 
              title="Mappe Mentali" 
              description="Visualizza concetti complessi con mappe interattive che stimolano la memoria visiva."
              placeholder="Crea connessioni tra idee"
              iconBgClass="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
              placeholderTextClass="text-blue-600 dark:text-blue-300"
            />
          </Link>
          
          <Link href="/dashboard?view=flashcards">
            <FeatureCard 
              icon={<Files className="w-8 h-8" />} 
              title="Flashcards" 
              description="Memorizza efficacemente con il sistema di ripetizione spaziata basato su flashcards."
              placeholder="Algoritmo di ripetizione spaziata"
              iconBgClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
              placeholderTextClass="text-green-600 dark:text-green-300"
            />
          </Link>
          
          <Link href="/dashboard?view=ai-chat">
            <FeatureCard 
              icon={<FlaskConical className="w-8 h-8" />} 
              title="Assistente AI" 
              description="Ottieni risposte immediate alle tue domande con il nostro assistente basato su AI."
              placeholder="Chiedi e ottieni aiuto"
              iconBgClass="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
              placeholderTextClass="text-red-600 dark:text-red-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 