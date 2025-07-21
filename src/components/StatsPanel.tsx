import React from 'react';
import { usePearl } from '../state/pearlStore';

const StatRow: React.FC<{ label: string; value: number; color?: string }> = ({ 
  label, 
  value, 
  color = 'default' 
}) => {
  const getBarColor = () => {
    if (color !== 'default') return color;
    if (value < 30) return 'bg-pp-error';
    if (value < 60) return 'bg-pp-warn';
    return 'bg-gradient-to-r from-pp-accent1 via-pp-accent2 to-pp-accent3';
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-pp-text">{label}</span>
        <span className="text-pp-text-dim">{Math.round(value)}</span>
      </div>
      <div className="stat-bar h-2">
        <span 
          className={getBarColor()}
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};

const BOND_TITLES = ['Acquainted', 'Familiar', 'Comfortable', 'Trusted', 'Close', 'Attached', 'Cherished'];

export const StatsPanel: React.FC = () => {
  const { 
    hunger, 
    hygiene, 
    energy, 
    happiness, 
    bondLevel, 
    bondProgress, 
    statusFlags,
    mood
  } = usePearl();

  return (
    <div className="pearl-card bg-black/80 backdrop-blur-md border border-white/20 max-w-xs">
      <h3 className="text-sm font-semibold gradient-text mb-3">Pearl Status</h3>
      
      {/* Primary Stats */}
      <StatRow label="Hunger" value={hunger} />
      <StatRow label="Energy" value={energy} />
      <StatRow label="Hygiene" value={hygiene} />
      <StatRow label="Happiness" value={happiness} />
      
      {/* Bond Progress */}
      <div className="mb-3 pt-2 border-t border-gray-600">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-pp-text">Bond Level</span>
          <span className="text-pp-accent1">{bondLevel}</span>
        </div>
        <StatRow label="Progress" value={bondProgress} color="bg-gradient-to-r from-pp-accent1 to-pp-accent3" />
      </div>
      
      {/* Current Mood */}
      <div className="mb-2">
        <div className="flex justify-between text-xs">
          <span className="text-pp-text">Mood</span>
          <span className={`capitalize ${
            mood === 'happy' || mood === 'playful' ? 'text-pp-accent1' :
            mood === 'distressed' ? 'text-pp-error' :
            mood === 'low' ? 'text-pp-warn' : 'text-pp-text-dim'
          }`}>
            {mood}
          </span>
        </div>
      </div>
      
      {/* Status Effects */}
      {statusFlags.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-pp-text mb-1">Status</div>
          <div className="flex flex-wrap gap-1">
            {statusFlags.map(flag => (
              <span 
                key={flag}
                className={`px-1 py-0.5 rounded text-xs ${
                  flag === 'sick' || flag === 'leavingWarning' ? 'bg-pp-error/20 text-pp-error' :
                  flag === 'withdrawn' ? 'bg-pp-warn/20 text-pp-warn' :
                  'bg-pp-accent1/20 text-pp-accent1'
                }`}
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};