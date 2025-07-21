import React from 'react';
import { usePearl } from '../state/pearlStore';

export const AnalyticsDashboard: React.FC = () => {
  const { 
    sessionCount, 
    totalPlayTime, 
    activityCounts, 
    streakDays, 
    bondLevel,
    unlockedClips 
  } = usePearl();

  const totalActivities = Object.values(activityCounts).reduce((sum, count) => sum + count, 0);
  const favoriteActivity = Object.entries(activityCounts).reduce((a, b) => 
    activityCounts[a[0]] > activityCounts[b[0]] ? a : b, ['none', 0]
  )[0];

  return (
    <div className="pearl-card">
      <div className="pearl-glow"></div>
      <h3 className="text-lg font-semibold gradient-text mb-4">Your Journey</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-pp-accent1">{sessionCount}</div>
          <div className="text-gray-400">Sessions</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-pp-accent2">{streakDays}</div>
          <div className="text-gray-400">Day Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-pp-accent3">{totalActivities}</div>
          <div className="text-gray-400">Activities</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-pp-accent1">{unlockedClips.length}</div>
          <div className="text-gray-400">Rare Moments</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-300 mb-2">Most Used Activity</div>
        <div className="text-pp-accent1 font-semibold capitalize">{favoriteActivity}</div>
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-gray-300 mb-2">Bond Progress</div>
        <div className="text-pp-accent2">Level {bondLevel} - {BOND_TITLES[bondLevel] || 'Max'}</div>
      </div>
    </div>
  );
};

const BOND_TITLES = ['Acquainted', 'Familiar', 'Comfortable', 'Trusted', 'Close', 'Attached', 'Cherished'];