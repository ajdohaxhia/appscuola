'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Book, Brain, MessageSquare, Trophy, ChevronRight, Calendar, CheckCircle } from 'lucide-react';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  bgClass: string;
}

const ModuleCard = ({ icon, title, description, href, bgClass }: ModuleCardProps) => (
  <Link 
    href={href}
    className={`${bgClass} p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
  >
    <div className="p-4 bg-white/20 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm mb-4 opacity-90">{description}</p>
    <div className="mt-auto inline-flex items-center text-sm font-medium">
      Inizia ora
      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

const HeroSection = () => {
  const modules = [
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: "Note",
      description: "Crea e organizza appunti ricchi con editor avanzato",
      href: "/dashboard/notes",
      bgClass: "bg-gradient-to-br from-blue-600 to-blue-800 text-white"
    },
    {
      icon: <Book className="h-8 w-8 text-white" />,
      title: "Flashcards",
      description: "Memorizza concetti con la ripetizione spaziata",
      href: "/dashboard/flashcards",
      bgClass: "bg-gradient-to-br from-purple-600 to-purple-800 text-white"
    },
    {
      icon: <Brain className="h-8 w-8 text-white" />,
      title: "Mappe Mentali",
      description: "Visualizza connessioni tra concetti",
      href: "/dashboard/mindmaps",
      bgClass: "bg-gradient-to-br from-green-600 to-green-800 text-white"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      title: "AI Assistant",
      description: "Ottieni risposte e aiuto intelligente",
      href: "/dashboard/ai",
      bgClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white"
    },
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Calendario",
      description: "Organizza lezioni, compiti ed esami",
      href: "/dashboard/calendar",
      bgClass: "bg-gradient-to-br from-teal-600 to-teal-800 text-white"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Attività",
      description: "Gestisci compiti e attività scolastiche",
      href: "/dashboard/tasks",
      bgClass: "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white"
    }
  ];

  return (
    <section className="hero-gradient text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Studia <span className="text-primary-light">Smarter</span>, Non Harder</h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">La rivoluzionaria PWA per studenti che trasforma il tuo modo di apprendere con strumenti digitali avanzati e funzionalità innovative.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="cta-pulse bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105">
              Inizia Ora
            </Link>
            <Link href="#features" className="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded-full border-2 border-white transition duration-300">
              Scopri di più
            </Link>
          </div>
        </div>
        
        {/* Modules Grid */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Esplora i Moduli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {modules.map((module, index) => (
              <ModuleCard 
                key={index}
                icon={module.icon}
                title={module.title}
                description={module.description}
                href={module.href}
                bgClass={module.bgClass}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center bg-white text-primary-dark hover:bg-primary-light hover:text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              <Trophy className="mr-2 h-5 w-5" />
              <span>Guadagna Punti & Badge</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 