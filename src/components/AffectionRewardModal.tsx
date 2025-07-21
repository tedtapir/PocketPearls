import React from 'react';
import { Heart, X, Star, Sparkles } from 'lucide-react';
import { useCompanion } from '../context/CompanionContext';

const MILESTONE_MESSAGES = {
  1: { title: 'First Smile', message: 'She smiled at you for the first time!', emoji: '😊' },
  2: { title: 'Gratitude', message: 'She wants to thank you for caring...', emoji: '🙏' },
  3: { title: 'Growing Trust', message: 'She\'s starting to trust you more deeply.', emoji: '💙' },
  4: { title: 'Shared Secret', message: 'She wants to share something personal with you.', emoji: '🤫' },
  5: { title: 'Heart to Heart', message: 'She has something important to tell you...', emoji: '💕' }
};

export function AffectionRewardModal() {
  const { state, dispatch } = useCompanion();

  if (!state.showRewardModal || !state.latestUnlock) return null;

  const milestone = MILESTONE_MESSAGES[state.affectionMilestone as keyof typeof MILESTONE_MESSAGES];

  const handleClose = () => {
    dispatch({ type: 'CLOSE_REWARD_MODAL' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-gradient-to-br from-[#1A1A28] via-[#2A1A2A] to-[#1A1A28] rounded-3xl p-8 max-w-md w-full border-2 border-[#33FFCA]/30 relative overflow-hidden"
           style={{ boxShadow: '0 0 40px rgba(51, 255, 202, 0.3)' }}>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-[#33FFCA] rounded-full animate-ping opacity-60" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-[#FF66B3] rounded-full animate-pulse opacity-80" />
          <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-[#33FFCA] rounded-full animate-bounce opacity-40" />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#33FFCA] transition-colors p-2 rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-[#33FFCA] mr-2 animate-pulse" />
            <Star className="w-8 h-8 text-[#FF66B3] animate-pulse" />
            <Heart className="w-8 h-8 text-[#33FFCA] mx-2 animate-pulse" />
            <Star className="w-8 h-8 text-[#FF66B3] animate-pulse" />
            <Sparkles className="w-6 h-6 text-[#33FFCA] ml-2 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4" style={{ 
            textShadow: '0 0 10px rgba(51, 255, 202, 0.5)' 
          }}>
            {milestone.title}
          </h2>
          
          <div className="text-7xl mb-6 animate-bounce">
            {milestone.emoji}
          </div>
          
          <p className="text-[#33FFCA] text-lg leading-relaxed">
            {milestone.message}
          </p>
        </div>

        {/* Video Preview Area */}
        <div className="bg-black/50 rounded-2xl p-6 mb-6 border border-[#33FFCA]/20 relative overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-xl flex items-center justify-center relative">
            {/* Video placeholder */}
            <div className="text-center">
              <div className="text-5xl mb-3">🎬</div>
              <div className="text-white text-lg font-semibold">Special Video Unlocked!</div>
              <div className="text-gray-400 text-sm mt-2">
                {state.latestUnlock?.split('/').pop()}
              </div>
            </div>
            
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#33FFCA]/10 to-transparent animate-pulse" />
          </div>
          
          {/* Glow border */}
          <div className="absolute inset-0 rounded-2xl border border-[#33FFCA]/30 animate-pulse" />
        </div>

        {/* Affection Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Affection Level</span>
            <span className="text-white font-bold">{state.affection}/100</span>
          </div>
          <div className="w-full bg-[#1A1A28] rounded-full h-4 border border-gray-700/50">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#33FFCA] to-[#FF66B3] transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${state.affection}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="text-center mt-3">
            <span className="text-[#33FFCA] text-sm font-semibold">
              Milestone {state.affectionMilestone}/5 Reached!
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] hover:from-[#2DDDB3] hover:to-[#33FFCA] text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(51, 255, 202, 0.4)' }}
        >
          <span className="relative z-10">Continue Your Journey</span>
          
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
        </button>
      </div>
    </div>
  );
}