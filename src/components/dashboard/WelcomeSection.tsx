
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getTodayDateString, formatDate } from '@/lib/utils';

interface WelcomeSectionProps {
  name: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ name }) => {
  const today = new Date();
  const greeting = getGreeting();
  
  function getGreeting() {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  return (
    <Card className="mb-8 card-gradient overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">{greeting}, {name}!</h1>
            <p className="text-lg text-gray-600">{formatDate(today)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">Plan your day, boost your productivity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
