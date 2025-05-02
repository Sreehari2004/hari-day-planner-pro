
import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import globeBackground from '@/assets/globe-background.png';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex bg-background" 
      style={{ 
        backgroundImage: `url(${globeBackground})`, 
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(240, 240, 250, 0.8)', // Light purple/blue tint
        backgroundBlendMode: 'overlay'
      }}
    >
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto backdrop-blur-sm bg-background/75">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};
