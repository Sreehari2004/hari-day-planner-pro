
import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import bgPattern from '@/assets/bg-pattern.png';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex bg-background" 
      style={{ 
        backgroundImage: `url(${bgPattern})`, 
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto backdrop-blur-sm bg-background/90">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};
