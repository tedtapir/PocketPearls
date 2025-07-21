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

  const BOND_TITLES = ['Acquainted', 'Familiar', 'Comfortable', 'Trusted', 'Close', 'Attached', 'Cherished'];

  return (
    <div className="pearl-card bg-black/80 backdrop-blur-md border border-white/20 max-w-xs">
      <h3 className="text-sm font-semibold gradient-text mb-3">Your Journey</h3>
      
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="text-center">
          <div className="text-lg font-bold text-pp-accent1">{sessionCount}</div>
          <div className="text-gray-400">Sessions</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-pp-accent2">{streakDays}</div>
          <div className="text-gray-400">Day Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-pp-accent3">{totalActivities}</div>
          <div className="text-gray-400">Activities</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-pp-accent1">{unlockedClips.length}</div>
          <div className="text-gray-400">Rare Moments</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-300 mb-1">Most Used Activity</div>
        <div className="text-pp-accent1 font-semibold capitalize text-xs">{favoriteActivity}</div>
      </div>
      
      <div className="mt-3">
        <div className="text-xs text-gray-300 mb-1">Bond Progress</div>
        <div className="text-pp-accent2 text-xs">Level {bondLevel} - {BOND_TITLES[bondLevel] || 'Max'}</div>
      </div>
    </div>
  );
};