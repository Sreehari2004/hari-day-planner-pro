
import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background bg-opacity-95" style={{ backgroundImage: 'url(/src/assets/bg-pattern.png)', backgroundSize: 'cover' }}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
};
