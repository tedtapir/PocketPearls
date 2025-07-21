import React, { useState } from 'react';
import { Heart, Play, Lock, ArrowLeft, Star } from 'lucide-react';
import { useCompanion } from '../context/CompanionContext';

interface UnlockedVideosProps {
  onBack: () => void;
}

const MILESTONE_INFO = {
  1: { title: 'First Smile', description: 'Her first genuine smile', color: 'from-[#FFCA3A] to-[#FF8C42]' },
  2: { title: 'Gratitude', description: 'A heartfelt thank you', color: 'from-[#33FFCA] to-[#8AC6D1]' },
  3: { title: 'Growing Trust', description: 'Opening up to you', color: 'from-[#A0E7E5] to-[#33FFCA]' },
  4: { title: 'Shared Secret', description: 'Something personal', color: 'from-[#FF66B3] to-[#A855F7]' },
  5: { title: 'Heart to Heart', description: 'Her deepest feelings', color: 'from-[#F472B6] to-[#EC4899]' }
};

export function UnlockedVideos({ onBack }: UnlockedVideosProps) {
  const { state } = useCompanion();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const getCharacterName = () => {
    const names = ['Suze', 'Jules', 'Mina', 'Theo', 'Alex'];
    return names[state.characterID || 0];
  };

  const getMilestoneFromVideo = (videoPath: string): number => {
    if (videoPath.includes('bonus_smile')) return 1;
    if (videoPath.includes('thank_you')) return 2;
    if (videoPath.includes('trust_you_now')) return 3;
    if (videoPath.includes('shared_secret')) return 4;
    if (videoPath.includes('confession_scene')) return 5;
    return 0;
  };

  const renderVideoModal = () => {
    if (!selectedVideo) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
        <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl p-8 max-w-3xl w-full border-2 border-[#33FFCA]/30"
             style={{ boxShadow: '0 0 40px rgba(51, 255, 202, 0.3)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Special Moment</h3>
            <button
              onClick={() => setSelectedVideo(null)}
              className="text-gray-400 hover:text-[#33FFCA] transition-colors p-2 rounded-full hover:bg-white/5"
            >
              ✕
            </button>
          </div>
          
          <div className="aspect-video bg-black rounded-2xl flex items-center justify-center mb-6 border border-[#33FFCA]/20 relative overflow-hidden">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <div className="text-white text-xl">Video Player</div>
              <div className="text-gray-400 text-sm mt-2">
                {selectedVideo.split('/').pop()}
              </div>
            </div>
            
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#33FFCA]/5 to-transparent animate-pulse" />
          </div>
          
          <button
            onClick={() => setSelectedVideo(null)}
            className="w-full bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] hover:from-[#2DDDB3] hover:to-[#33FFCA] text-black font-bold py-3 rounded-2xl transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] p-6 font-mono relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent opacity-60" style={{ zIndex: -1 }} />
      
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-[#33FFCA] transition-colors mr-6 p-2 rounded-xl hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ 
              textShadow: '0 0 20px rgba(51, 255, 202, 0.4)' 
            }}>
              Special Moments with {getCharacterName()}
            </h1>
            <p className="text-[#33FFCA] text-lg">
              {state.unlockedVideos.length} of 5 moments unlocked
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 bg-[#1A1A28]/50 rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300 text-lg">Relationship Progress</span>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-[#33FFCA] mr-2" />
              <span className="text-white font-bold text-xl">{state.affectionMilestone}/5</span>
            </div>
          </div>
          <div className="w-full bg-[#101018] rounded-full h-4 border border-gray-700/50">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#33FFCA] to-[#FF66B3] transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${(state.affectionMilestone / 5) * 100}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((milestone) => {
            const isUnlocked = state.affectionMilestone >= milestone;
            const video = state.unlockedVideos.find(v => getMilestoneFromVideo(v) === milestone);
            const info = MILESTONE_INFO[milestone as keyof typeof MILESTONE_INFO];

            return (
              <div
                key={milestone}
                className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 ${
                  isUnlocked 
                    ? 'border-[#33FFCA]/50 hover:border-[#33FFCA] cursor-pointer transform hover:scale-105' 
                    : 'border-gray-700/50 opacity-60'
                }`}
                onClick={() => isUnlocked && video && setSelectedVideo(video)}
                style={isUnlocked ? { 
                  boxShadow: '0 0 30px rgba(51, 255, 202, 0.2)' 
                } : {}}
              >
                <div className="aspect-video bg-gradient-to-br from-[#1A1A28] to-[#101018] flex items-center justify-center relative">
                  {isUnlocked ? (
                    <div className="text-center">
                      <Play className="w-16 h-16 text-[#33FFCA] mb-4 mx-auto animate-pulse" />
                      <div className="text-white font-semibold text-lg">{info.title}</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Lock className="w-16 h-16 text-gray-600 mb-4 mx-auto" />
                      <div className="text-gray-600 font-semibold">Locked</div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${info.color} opacity-20`} />
                  
                  {/* Scan lines */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#33FFCA]/5 to-transparent animate-pulse" />
                </div>
                
                <div className="p-6 bg-gradient-to-b from-[#1A1A28] to-[#101018]">
                  <h3 className="font-semibold text-white mb-2 text-lg">{info.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{info.description}</p>
                  
                  {isUnlocked && (
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-[#FF66B3] mr-2" />
                      <span className="text-xs text-[#FF66B3] font-semibold">Unlocked</span>
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <div className="text-xs text-gray-600">
                      Requires {milestone * 20} affection
                    </div>
                  )}
                </div>
                
                {/* Hover glow effect */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#33FFCA]/10 to-[#FF66B3]/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {state.unlockedVideos.length === 0 && (
          <div className="text-center py-16 bg-[#1A1A28]/30 rounded-3xl border border-gray-700/50 mt-8">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">No Special Moments Yet</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Keep caring for {getCharacterName()} to unlock special videos and deepen your bond.
            </p>
          </div>
        )}
      </div>

      {renderVideoModal()}
    </div>
  );
}