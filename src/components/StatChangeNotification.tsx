import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Heart, Zap, Droplets, Smile } from 'lucide-react';

interface StatChange {
  stat: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface StatChangeNotificationProps {
  changes: Record<string, number>;
  message: string;
  onClose: () => void;
}

export const StatChangeNotification: React.FC<StatChangeNotificationProps> = ({
  changes,
  message,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStatInfo = (stat: string): { icon: React.ReactNode; color: string; label: string } => {
    switch (stat) {
      case 'hunger':
        return { icon: <Droplets className="w-4 h-4" />, color: 'text-blue-400', label: 'Hunger' };
      case 'energy':
        return { icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400', label: 'Energy' };
      case 'hygiene':
        return { icon: <Droplets className="w-4 h-4" />, color: 'text-cyan-400', label: 'Hygiene' };
      case 'happiness':
        return { icon: <Smile className="w-4 h-4" />, color: 'text-pink-400', label: 'Happiness' };
      case 'affection':
        return { icon: <Heart className="w-4 h-4" />, color: 'text-red-400', label: 'Affection' };
      case 'trust':
        return { icon: <Heart className="w-4 h-4" />, color: 'text-purple-400', label: 'Trust' };
      case 'comfort':
        return { icon: <Heart className="w-4 h-4" />, color: 'text-green-400', label: 'Comfort' };
      default:
        return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-gray-400', label: stat };
    }
  };

  const statChanges: StatChange[] = Object.entries(changes)
    .filter(([_, change]) => change !== 0)
    .map(([stat, change]) => {
      const info = getStatInfo(stat);
      return {
        stat,
        change,
        icon: info.icon,
        color: info.color
      };
    });

  if (statChanges.length === 0) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-2xl p-4 border-2 border-[#33FFCA]/30 max-w-sm"
           style={{ boxShadow: '0 0 20px rgba(51, 255, 202, 0.3)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Activity Result</h3>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-[#33FFCA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-[#33FFCA] text-sm mb-3">{message}</p>

        {/* Stat Changes */}
        <div className="space-y-2">
          {statChanges.map(({ stat, change, icon, color }) => {
            const info = getStatInfo(stat);
            return (
              <div key={stat} className="flex items-center justify-between bg-black/30 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className={color}>{icon}</span>
                  <span className="text-white text-sm capitalize">{info.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-sm font-semibold ${
                    change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {change > 0 ? '+' : ''}{change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sparkle effect */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#33FFCA] rounded-full animate-ping opacity-60" />
      </div>
    </div>
  );
};