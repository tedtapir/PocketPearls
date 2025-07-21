import React, { useState } from 'react';
import { usePearl } from '../state/pearlStore';
import { ActivityModal } from './ActivityModal';
import { VideoPlayer } from './VideoPlayer';

export const ActionBar: React.FC = () => {
  const { feed, talk, play, wash, canPerformActivity } = usePearl();
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
      default:
        return;
    }
    
    setLastResult(result);
    
    // Show activity clip if available
    if (result.clipPath) {
      setActivityClip(result.clipPath);
      // Don't auto-hide for wash - let video play to completion
      if (activity !== 'wash') {
        setTimeout(() => setActivityClip(null), 3000);
      }
    }
    
    // Show result briefly
    setTimeout(() => setLastResult(null), 3000);
  };

  return (
    <>
      {/* Activity Clip Overlay */}
      {activityClip && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="relative">
            <VideoPlayer
              src={activityClip}
              className="w-screen h-screen"
              loop={false}
              autoPlay={true}
              onEnded={() => setActivityClip(null)}
            />
          </div>
        </div>
      )}
      
      {/* Bottom Action Bar */}
      <div className="bg-black/80 backdrop-blur-md border-t border-white/20 p-3 sm:p-4 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-lg mx-auto px-2">
          {/* Feed Button */}
          <button
            onClick={() => setActiveModal('feed')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(255,202,58,0.8)]">
              🍲
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FFCA3A]">
              Feed
            </span>
          </button>

          {/* Talk Button */}
          <button
            onClick={() => setActiveModal('talk')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(138,198,209,0.8)]">
              💬
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#8AC6D1]">
              Talk
            </span>
          </button>

          {/* Play Button */}
          <button
            onClick={() => setActiveModal('play')}
            disabled={!canPerformActivity('play')}
            className={`group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform min-w-[60px] sm:min-w-[80px] ${
              canPerformActivity('play') 
                ? 'hover:scale-105 active:scale-95 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <div className={`text-2xl sm:text-3xl mb-1 ${
              canPerformActivity('play') 
                ? 'group-hover:drop-shadow-[0_0_12px_rgba(160,231,229,0.8)]' 
                : 'grayscale'
            }`}>
              🎮
            </div>
            <span className={`text-xs sm:text-sm font-semibold ${
              canPerformActivity('play') ? 'text-white group-hover:text-[#A0E7E5]' : 'text-gray-600'
            }`}>
              Play
            </span>
          </button>

          {/* Wash Button */}
          <button
            onClick={() => setActiveModal('wash')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(51,255,202,0.8)]">
              🚿
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#33FFCA]">
              Wash
            </span>
          </button>
        </div>
      </div>

      {/* Result Message */}
      {lastResult && (
        <div className={`fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-30 p-3 rounded-lg max-w-xs mx-4 ${
          lastResult.success ? 'bg-green-900/80 border border-green-600' : 'bg-red-900/80 border border-red-600'
        } backdrop-blur-md`}>
          <p className="text-sm text-white text-center">{lastResult.message}</p>
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