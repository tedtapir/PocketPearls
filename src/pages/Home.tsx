import React from 'react';
import { PearlAvatar } from '../components/PearlAvatar';
import { StatsPanel } from '../components/StatsPanel';
import { ActionBar } from '../components/ActionBar';
import { NotificationSystem } from '../components/NotificationSystem';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { usePearlTicker } from '../hooks/usePearlTicker';

export const Home: React.FC = () => {
  usePearlTicker();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <NotificationSystem />
      
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">PocketPearl</h1>
        <div className="text-sm text-gray-400">Full Release</div>
      </header>
      
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PearlAvatar />
          <div className="mt-6">
            <ActionBar />
          </div>
        </div>
        
        <div className="space-y-6">
          <StatsPanel />
        </div>
        
        <div className="lg:block hidden">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};