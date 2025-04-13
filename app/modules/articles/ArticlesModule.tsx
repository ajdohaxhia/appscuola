'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, Tag, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
}

// Sample data for articles
const SAMPLE_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Come le PWA stanno rivoluzionando l'educazione",
    excerpt: "Scopri perché le Progressive Web App sono la scelta ideale per le applicazioni educative moderne.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    author: "Marco Rossi",
    category: "Tecnologia",
    date: "15 Maggio 2023",
    readTime: "5 min",
    imageUrl: "/images/articles/pwa-education.jpg",
    slug: "pwa-education"
  },
  {
    id: 2,
    title: "5 tecniche per memorizzare meglio con le flashcards",
    excerpt: "Strategie scientificamente provate per sfruttare al massimo il sistema di ripetizione spaziata.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    author: "Laura Bianchi",
    category: "Metodi di Studio",
    date: "2 Maggio 2023",
    readTime: "7 min",
    imageUrl: "/images/articles/flashcards-techniques.jpg",
    slug: "flashcards-techniques"
  },
  {
    id: 3,
    title: "L'uso della realtà aumentata nell'apprendimento",
    excerpt: "Come la tecnologia AR può aiutare gli studenti a visualizzare concetti complessi.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    author: "Giovanni Verdi",
    category: "Innovazione",
    date: "20 Aprile 2023",
    readTime: "6 min",
    imageUrl: "/images/articles/ar-learning.jpg",
    slug: "ar-learning"
  },
  {
    id: 4,
    title: "Gamification: quando studiare diventa un gioco",
    excerpt: "Scopri come elementi di gamification possono aumentare la motivazione e l'apprendimento.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    author: "Chiara Neri",
    category: "Gamification",
    date: "10 Aprile 2023",
    readTime: "4 min",
    imageUrl: "/images/articles/gamification.jpg",
    slug: "gamification"
  }
];

// Categories
const CATEGORIES = [
  'Tutte',
  'Tecnologia',
  'Metodi di Studio',
  'Innovazione',
  'Gamification',
  'AR/VR',
  'AI',
];

export function ArticlesModule() {
  const [articles, setArticles] = useState<Article[]>(SAMPLE_ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutte');
  
  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutte' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-primary dark:text-primary-light">Articoli e Guide</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca articoli..."
              className="pl-10 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              className="w-full md:w-auto p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">Nessun articolo trovato con i criteri di ricerca specificati.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Article Card Component
function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:transform hover:scale-[1.02]">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400 font-medium">IMMAGINE ARTICOLO</span>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <Tag className="h-4 w-4 text-primary dark:text-primary-light mr-1" />
          <span className="text-sm text-primary dark:text-primary-light">{article.category}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{article.excerpt}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{article.readTime}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{article.date}</span>
          </div>
          <Link 
            href={`/articles/${article.slug}`}
            className="flex items-center text-primary dark:text-primary-light font-medium hover:underline"
          >
            Leggi
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArticlesModule; 