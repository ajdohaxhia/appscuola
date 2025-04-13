'use client';

import React from 'react';
import InstallPWA from './InstallPWA';

const Step = ({ number, title, description }: { number: number, title: string, description: string }) => {
  return (
    <div className="text-center">
      <div className="step-number bg-primary text-white mx-auto">{number}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light">Come Funziona</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Inizia a usare AppScuola in pochi semplici passaggi, senza bisogno di registrazione.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Step 
            number={1} 
            title="Aggiungi alla Home" 
            description="Installa AppScuola come una normale app dal tuo browser per accedervi facilmente."
          />
          
          <Step 
            number={2} 
            title="Scegli i Tuoi Strumenti" 
            description="Seleziona tra le diverse funzionalità quelle più adatte al tuo stile di apprendimento."
          />
          
          <Step 
            number={3} 
            title="Inizia a Studiare" 
            description="Usa gli strumenti per organizzare il tuo studio e migliorare la tua produttività."
          />
        </div>
        
        {/* PWA Installation Prompt */}
        <div className="mt-16 text-center">
          <InstallPWA />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 