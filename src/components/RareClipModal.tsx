import React from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface RareClipModalProps {
  clipPath: string | null;
  onClose: () => void;
}

export const RareClipModal: React.FC<RareClipModalProps> = ({ clipPath, onClose }) => {
  if (!clipPath) return null;

  const getClipTitle = (path: string) => {
    if (path.includes('spontaneous_laugh')) return 'Spontaneous Laughter';
    if (path.includes('thoughtful_moment')) return 'Thoughtful Moment';
    if (path.includes('gentle_smile')) return 'Gentle Smile';
    if (path.includes('content_sigh')) return 'Content Sigh';
    return 'Special Moment';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="pearl-card max-w-md w-full relative overflow-hidden">
        <div className="pearl-glow"></div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-pp-accent1 rounded-full animate-ping opacity-60" />
          <div className="absolute top-8 right-8 w-1 h-1 bg-pp-accent3 rounded-full animate-pulse opacity-80" />
          <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pp-accent2 rounded-full animate-bounce opacity-40" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pp-accent1 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-pp-accent1 mr-2 animate-pulse" />
            <Star className="w-8 h-8 text-pp-accent3 animate-pulse" />
            <Sparkles className="w-6 h-6 text-pp-accent1 ml-2 animate-pulse" />
          </div>
          
          <h2 className="text-xl font-semibold gradient-text mb-2">
            Rare Moment Unlocked!
          </h2>
          
          <h3 className="text-lg text-white mb-4">
            {getClipTitle(clipPath)}
          </h3>
        </div>

        {/* Video placeholder */}
        <div className="aspect-video bg-pp-bg-alt rounded-lg mb-6 border border-pp-accent1/20 overflow-hidden">
          <VideoPlayer
            src={clipPath}
            className="w-full h-full"
            loop={true}
            autoPlay={true}
            fallbackEmoji="✨"
          />
        </div>

        <div className="text-center text-gray-300 text-sm mb-6">
          These special moments happen when you've been especially caring. 
          Keep nurturing your bond to unlock more!
        </div>

        <button
          onClick={onClose}
          className="pp-btn primary w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};