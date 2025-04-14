import React, { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import BenefitsSection from '@/app/components/BenefitsSection';
import ArVrSection from '@/app/components/ArVrSection';
import NewsSection from '@/app/components/NewsSection';
import InstallPWA from '@/app/components/InstallPWA';

function HomeContent() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 dark:bg-primary-dark dark:text-white">
      <Header />
      
      <HeroSection />
      
      <FeaturesSection />
      
      <HowItWorksSection />
      
      <BenefitsSection />
      
      <ArVrSection />
      
      <NewsSection />
      
      <InstallPWA />
      
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
} 