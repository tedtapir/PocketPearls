import React, { useState } from 'react';
import { usePearl } from '../state/pearlStore';
import { ActivityModal } from './ActivityModal';
import { VideoPlayer } from './VideoPlayer';
import { PearlChat } from './PearlChat';

export const ActionBar: React.FC = () => {
  const { feed, talk, play, wash, tidy, sleepAssist, giveMedicine, playGemsGame, canPerformActivity, statusFlags } = usePearl();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activityClip, setActivityClip] = useState<string | null>(null);
  const [showAppreciation, setShowAppreciation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleActivity = (activity: string, options?: any) => {
    console.log('handleActivity called with:', activity, options);
    let result;
    
    switch (activity) {
      case 'feed':
        result = feed(options);
        break;
      case 'talk':
        result = talk(options);
        break;
      case 'play':
        result = play(options);
        break;
      case 'wash':
        result = wash();
        break;
      case 'tidy':
        result = tidy();
        break;
      case 'sleep':
        result = sleepAssist();
        console.log('sleepAssist result:', result);
        break;
      case 'medicine':
        result = giveMedicine();
        break;
      case 'gems':
        result = playGemsGame();
        break;
      default:
        return;
    }
    
    setLastResult(result);
    
    // Show activity clip if available
    if (result && result.success && result.clipPath && result.clipPath !== '') {
      console.log('Setting activity clip to:', result.clipPath);
      setActivityClip(result.clipPath);
    } else if (result && result.success) {
      // If no activity clip, go straight to appreciation
      setShowAppreciation(true);
    }
    
    // Show result briefly
    setTimeout(() => setLastResult(null), 3000);
  };

  const handleActivityClipEnd = () => {
    setActivityClip(null);
    // Don't show appreciation for feed activity, just return to normal idle
    if (lastResult?.success) {
      // Brief pause before returning to normal idle state
      setTimeout(() => {
        // This will trigger the PearlAvatar to show the updated mood
      }, 500);
    }
  };

  const handleAppreciationEnd = () => {
    setShowAppreciation(false);
  };

  return (
    <>
      {/* Activity Clip Overlay */}
      {activityClip && (
        <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-300 ${
          activityClip ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="relative">
            <VideoPlayer
              src={activityClip}
              className="w-screen h-screen"
              loop={false}
              autoPlay={true}
              onEnded={handleActivityClipEnd}
            />
          </div>
        </div>
      )}
      
      {/* Appreciation Video Overlay */}
      {showAppreciation && (
        <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-300 ${
          showAppreciation ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="relative">
            <VideoPlayer
              src="/videos/pearl_appreciation_1.mp4"
              className="w-screen h-screen"
              loop={false}
              autoPlay={true}
              onEnded={handleAppreciationEnd}
            />
          </div>
        </div>
      )}
      
      {/* Bottom Action Bar */}
      <div className="bg-black/80 backdrop-blur-md border-t border-white/20 p-3 sm:p-4 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-3xl mx-auto px-2">
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
            onClick={() => setChatOpen(true)}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(138,198,209,0.8)]">
              💬
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#8AC6D1]">
              Chat
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

          {/* Tidy Button */}
          <button
            onClick={() => setActiveModal('tidy')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(160,231,229,0.8)]">
              🧹
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#A0E7E5]">
              Tidy
            </span>
          </button>
          {/* Sleep Button */}
          <button
            onClick={() => setActiveModal('sleep')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(147,51,234,0.8)]">
              😴
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#9333EA]">
              Sleep
            </span>
          </button>

          {/* Gems Button */}
          <button
            onClick={() => handleActivity('gems')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px]"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]">
              💎
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400">
              Gems
            </span>
          </button>
        </div>
        
        {/* Medicine Button - Only show when sick */}
        {statusFlags.includes('sick') && (
          <button
            onClick={() => handleActivity('medicine')}
            className="group flex flex-col items-center p-2 sm:p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[60px] sm:min-w-[80px] bg-red-900/20 border border-red-500/30"
          >
            <div className="text-2xl sm:text-3xl mb-1 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
              💊
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-red-400">
              Medicine
            </span>
          </button>
        )}
      </div>

      {/* Pearl Chat */}
      <PearlChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

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