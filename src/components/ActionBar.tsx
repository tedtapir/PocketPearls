import React, { useState } from 'react';
import { usePearl } from '../state/pearlStore';
import { ActionButton } from './ActionButton';
import { ActivityModal } from './ActivityModal';
import { VideoPlayer } from './VideoPlayer';
import { resolveClip } from '../utils/clipResolver';

export const ActionBar: React.FC = () => {
  const { feed, talk, play, wash, sleepAssist, tidy, comfort, confide, giveGift, canPerformActivity, bondLevel } = usePearl();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activityClip, setActivityClip] = useState<string | null>(null);

  const handleActivity = (activity: string, options?: any) => {
    let result;
    
    switch (activity) {
      case 'feed':
        result = feed(options);
        break;
      case 'talk':
        result = talk(options);
        break;
      case 'play':
        result = play();
        break;
      case 'wash':
        result = wash();
        break;
      case 'sleep':
        result = sleepAssist();
        break;
      case 'tidy':
        result = tidy();
        break;
      case 'comfort':
        result = comfort();
        break;
      case 'confide':
        result = confide();
        break;
      case 'gift':
        result = giveGift(options || 'flower');
        break;
      default:
        return;
    }
    
    setLastResult(result);
    
    // Show activity clip if available
    if (result.clipPath) {
      setActivityClip(result.clipPath);
      // Auto-hide after 3 seconds
      setTimeout(() => setActivityClip(null), 3000);
    }
    
    // Show result briefly
    setTimeout(() => setLastResult(null), 3000);
  };

  return (
    <>
      {/* Activity Clip Overlay */}
      {activityClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <VideoPlayer
              src={activityClip}
              className="w-80 h-80 rounded-2xl"
              loop={false}
              onEnded={() => setActivityClip(null)}
            />
            <button
              onClick={() => setActivityClip(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        <ActionButton 
          label="Feed" 
          onClick={() => setActiveModal('feed')} 
          primary 
          disabled={false}
        />
        <ActionButton 
          label="Talk" 
          onClick={() => setActiveModal('talk')} 
          disabled={false}
        />
        <ActionButton 
          label="Play" 
          onClick={() => setActiveModal('play')} 
          disabled={!canPerformActivity('play')}
        />
        <ActionButton 
          label="Wash" 
          onClick={() => setActiveModal('wash')} 
          disabled={false}
        />
        <ActionButton 
          label="Sleep" 
          onClick={() => setActiveModal('sleep')} 
          disabled={!canPerformActivity('sleepAssist')}
        />
      </div>
      
      {/* Advanced Activities Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ActionButton 
          label="Tidy" 
          onClick={() => setActiveModal('tidy')} 
          disabled={!canPerformActivity('tidy')}
        />
        <ActionButton 
          label="Comfort" 
          onClick={() => setActiveModal('comfort')} 
          disabled={false}
        />
        <ActionButton 
          label="Confide" 
          onClick={() => setActiveModal('confide')} 
          disabled={bondLevel < 3}
        />
        <ActionButton 
          label="Gift" 
          onClick={() => setActiveModal('gift')} 
          disabled={false}
        />
      </div>

      {lastResult && (
        <div className={`mt-4 p-3 rounded-lg ${
          lastResult.success ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'
        }`}>
          <p className="text-sm text-white">{lastResult.message}</p>
          {Object.keys(lastResult.statChanges).length > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {Object.entries(lastResult.statChanges).map(([stat, change]) => (
                <span key={stat} className="mr-2">
                  {stat}: {change > 0 ? '+' : ''}{change}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <ActivityModal
        activity={activeModal as any}
        onClose={() => setActiveModal(null)}
        onConfirm={(options) => handleActivity(activeModal!, options)}
      />
    </>
  );
};