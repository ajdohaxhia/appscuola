'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, Book } from 'lucide-react';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-primary-dark/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <svg className="w-10 h-10 text-primary dark:text-primary-light" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V16.01M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18.364 5.63604L16.9497 7.05025M7.05025 16.9497L5.63604 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="ml-2 text-2xl font-bold text-primary dark:text-primary-light">AppScuola</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="nav-link font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              Funzionalità
            </Link>
            <Link href="#how-it-works" className="nav-link font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              Come Funziona
            </Link>
            <Link href="#benefits" className="nav-link font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              Vantaggi
            </Link>
            <Link href="#ar-vr" className="nav-link font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              AR/VR
            </Link>
            <Link href="#news" className="nav-link font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
              News
            </Link>
            <Link 
              href="/dashboard" 
              className="nav-link font-medium bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md flex items-center"
            >
              <Book size={18} className="mr-2" />
              App
            </Link>
          </nav>
          
          {/* Dark/Light Mode Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="md:hidden p-2 bg-primary hover:bg-primary-light text-white rounded-md"
              aria-label="Open app"
            >
              <Book size={20} />
            </Link>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-blue-200 toggle-moon" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400 toggle-sun" />
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu md:hidden mt-4 ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="flex flex-col space-y-3 py-4">
            <Link href="#features" className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Funzionalità
            </Link>
            <Link href="#how-it-works" className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Come Funziona
            </Link>
            <Link href="#benefits" className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Vantaggi
            </Link>
            <Link href="#ar-vr" className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              AR/VR
            </Link>
            <Link href="#news" className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              News
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 