'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    StickyNote, 
    ClipboardList, 
    CalendarDays, 
    GraduationCap, 
    Settings, 
    Menu, 
    X, 
    Sun, 
    Moon,
    Bot,
    Network
} from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is used (from providers.tsx)

const sidebarNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/notes', label: 'Appunti', icon: StickyNote },
  { href: '/dashboard/tasks', label: 'Compiti', icon: ClipboardList },
  { href: '/dashboard/calendar', label: 'Calendario', icon: CalendarDays },
  { href: '/dashboard/flashcards', label: 'Flashcard', icon: GraduationCap },
  { href: '/dashboard/mindmaps', label: 'Mappe Mentali', icon: Network },
  { href: '/dashboard/ai', label: 'Assistente AI', icon: Bot },
  { href: '/dashboard/settings', label: 'Impostazioni', icon: Settings },
];

export default function DashboardLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */} 
      <aside 
        className={`absolute md:static z-30 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        {/* Logo/Brand */} 
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className="text-2xl font-bold text-primary dark:text-primary-light">
            AppScuola
          </Link>
          <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              aria-label="Chiudi sidebar"
          >
              <X size={20} />
          </button>
        </div>
        
        {/* Navigation */} 
        <nav className="flex-1 py-4 space-y-1">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md mx-2 transition-colors ${pathname === item.href ? 'bg-primary-light/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on navigation in mobile
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer/Settings in Sidebar */} 
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={toggleTheme} 
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
            {theme === 'dark' ? 'Tema Chiaro' : 'Tema Scuro'}
          </button>
          {/* Add other items like Logout if needed */} 
        </div>
      </aside>

      {/* Main Content Area */} 
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar for Mobile */} 
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Apri sidebar"
          >
            <Menu size={24} />
          </button>
          {/* Maybe show current page title here */} 
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {sidebarNavItems.find(item => item.href === pathname)?.label || 'Dashboard'}
          </span>
          {/* Placeholder for maybe profile icon or other actions */} 
          <div></div>
        </header>
        
        {/* Page Content */} 
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {/* Child pages will be rendered here */} 
          {children}
        </main>
      </div>
    </div>
  );
} 