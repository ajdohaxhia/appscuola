'use client';

import React from 'react';
import { Cloud, Lock, Lightbulb, Smartphone } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgClass: string;
}

const Benefit = ({ icon, title, description, iconBgClass }: BenefitProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center mb-4">
        <div className={`${iconBgClass} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light">Vantaggi</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Perché scegliere AppScuola per il tuo percorso di studi?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Benefit 
            icon={<Cloud className="w-6 h-6 text-primary dark:text-primary-light" />}
            title="Funziona Offline"
            description="Studia ovunque, anche senza connessione internet. I tuoi dati si sincronizzeranno automaticamente quando torni online."
            iconBgClass="bg-purple-100 dark:bg-purple-900"
          />
          
          <Benefit 
            icon={<Lock className="w-6 h-6 text-blue-600 dark:text-blue-300" />}
            title="Nessun Login"
            description="Inizia subito a usare l'app senza perdere tempo con registrazioni o autenticazioni complicate."
            iconBgClass="bg-blue-100 dark:bg-blue-900"
          />
          
          <Benefit 
            icon={<Lightbulb className="w-6 h-6 text-green-600 dark:text-green-300" />}
            title="Integrazione AI"
            description="L'intelligenza artificiale ti aiuta a organizzare lo studio e a trovare le risposte che cerchi."
            iconBgClass="bg-green-100 dark:bg-green-900"
          />
          
          <Benefit 
            icon={<Smartphone className="w-6 h-6 text-red-600 dark:text-red-300" />}
            title="Multidevice"
            description="Accedi ai tuoi dati da qualsiasi dispositivo, sempre aggiornati e sincronizzati."
            iconBgClass="bg-red-100 dark:bg-red-900"
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;