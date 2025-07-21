import React from 'react';
import { usePearl } from '../../state/pearlStore';

export const StreakBadge: React.FC = () => {
  const { streakDays } = usePearl();

  if (streakDays === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="font-bold text-sm">{streakDays}</span>
      </div>
    </div>
  );
};