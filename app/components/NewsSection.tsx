'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface NewsCardProps {
  category: string;
  date: string;
  title: string;
  description: string;
  textColorClass: string;
  imageUrl: string;
  slug: string;
}

const NewsCard = ({ category, date, title, description, textColorClass, imageUrl, slug }: NewsCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300">
      <div className="h-48 relative overflow-hidden">
        {/* Fallback for development */}
        {!imageUrl.startsWith('/') ? (
          <div className="h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 font-medium">IMMAGINE DEL POST</span>
          </div>
        ) : (
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-6">
        <span className={`text-sm ${textColorClass} font-medium`}>{category} • {date}</span>
        <h3 className="text-xl font-bold my-3 line-clamp-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{description}</p>
        <Link href={`/articles/${slug}`} className={`${textColorClass} font-medium hover:underline flex items-center`}>
          Leggi di più 
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

const NewsSection = () => {
  const articles = [
    {
      category: "Tecnologia",
      date: "15 Maggio 2023",
      title: "Come le PWA stanno rivoluzionando l'educazione",
      description: "Scopri perché le Progressive Web App sono la scelta ideale per le applicazioni educative moderne.",
      textColorClass: "text-primary dark:text-primary-light",
      imageUrl: "/images/articles/pwa-education.jpg",
      slug: "pwa-education"
    },
    {
      category: "Metodi di Studio",
      date: "2 Maggio 2023",
      title: "5 tecniche per memorizzare meglio con le flashcards",
      description: "Strategie scientificamente provate per sfruttare al massimo il sistema di ripetizione spaziata.",
      textColorClass: "text-blue-600 dark:text-blue-300",
      imageUrl: "/images/articles/flashcards-techniques.jpg",
      slug: "flashcards-techniques"
    },
    {
      category: "Innovazione",
      date: "20 Aprile 2023",
      title: "L'uso della realtà aumentata nell'apprendimento",
      description: "Come la tecnologia AR può aiutare gli studenti a visualizzare concetti complessi.",
      textColorClass: "text-green-600 dark:text-green-300",
      imageUrl: "/images/articles/ar-learning.jpg",
      slug: "ar-learning"
    }
  ];

  return (
    <section id="news" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light">News & Articoli</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Rimani aggiornato sulle ultime novità e consigli per il tuo studio.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <NewsCard
              key={index}
              category={article.category}
              date={article.date}
              title={article.title}
              description={article.description}
              textColorClass={article.textColorClass}
              imageUrl={article.imageUrl}
              slug={article.slug}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/articles" className="inline-block bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center space-x-2 mx-auto w-auto">
            <span>Vedi tutti gli articoli</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection; 