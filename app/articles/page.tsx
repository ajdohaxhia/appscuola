'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const articles: Article[] = [
  {
    slug: 'flashcards-techniques',
    title: 'Tecniche Avanzate di Studio con Flashcard',
    description: 'Scopri come ottimizzare il tuo studio attraverso l\'uso strategico delle flashcard e della ripetizione spaziata.',
    date: '10 Maggio 2023',
    readTime: '5 minuti',
    category: 'Metodi di Studio',
    image: '/images/articles/flashcards-techniques.jpg'
  },
  {
    slug: 'pwa-education',
    title: 'PWA nell\'Educazione',
    description: 'Come le Progressive Web App stanno trasformando l\'accesso alle risorse educative e migliorando l\'esperienza di apprendimento.',
    date: '15 Giugno 2023',
    readTime: '8 minuti',
    category: 'Tecnologia Educativa',
    image: '/images/articles/pwa-education.jpg'
  },
  {
    slug: 'ar-learning',
    title: 'Realtà Aumentata nell\'Educazione',
    description: 'Esplora come la realtà aumentata sta rivoluzionando l\'apprendimento attraverso esperienze immersive e interattive.',
    date: '15 Giugno 2023',
    readTime: '7 minuti',
    category: 'Tecnologia Educativa',
    image: '/images/articles/ar-learning.jpg'
  }
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Articoli
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Approfondimenti, guide e risorse per migliorare il tuo percorso di apprendimento
            con le più recenti metodologie e tecnologie educative.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.slug} 
              href={`/articles/${article.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-primary-light">
                    {article.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {article.description}
                </p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{article.readTime} di lettura</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
                  Leggi articolo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Hai un argomento da suggerire?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Siamo sempre alla ricerca di nuovi argomenti da approfondire. Se hai un'idea o una richiesta per un
                articolo che vorresti vedere, faccelo sapere!
              </p>
              <div>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Contattaci
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src="/images/suggestion-box.jpg"
                  alt="Suggestion box"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 