import React, { useState } from 'react';
import { ArrowLeft, Heart, Video } from 'lucide-react';
import { useCompanion } from '../context/CompanionContext';
import { UnlockedVideos } from './UnlockedVideos';

interface CompanionScreenProps {
  onBackToSelect: () => void;
}

export function CompanionScreen({ onBackToSelect }: CompanionScreenProps) {
  const { state, dispatch } = useCompanion();
  const [showUnlockedVideos, setShowUnlockedVideos] = useState(false);

  if (showUnlockedVideos) {
    return <UnlockedVideos onBack={() => setShowUnlockedVideos(false)} />;
  }

  const getCharacterName = () => {
    const names = ['Suze', 'Jules', 'Mina', 'Theo', 'Alex'];
    return names[state.characterID || 0];
  };

  const handleFeed = () => {
    const now = Date.now();
    if (now >= state.cooldowns.feed) {
      dispatch({ type: 'FEED' });
    }
  };

  const handleTalk = () => {
    const now = Date.now();
    if (now >= state.cooldowns.talk) {
      dispatch({ type: 'TALK' });
    }
  };

  const handlePlay = () => {
    const now = Date.now();
    if (now >= state.cooldowns.play) {
      dispatch({ type: 'PLAY' });
    }
  };

  const getCooldownText = (cooldownTime: number) => {
    const now = Date.now();
    if (now >= cooldownTime) return 'Ready';
    
    const remaining = Math.ceil((cooldownTime - now) / (60 * 1000));
    return `${remaining}m`;
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'needy': return '🥺';
      case 'sleeping': return '😴';
      default: return '😐';
    }
  };

  const getStatColor = (value: number) => {
    if (value > 70) return 'text-[#33FFCA]';
    if (value > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent opacity-60" style={{ zIndex: -1 }} />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-[#12121A]/80 backdrop-blur-sm border-b border-gray-800/50">
        <button
          onClick={onBackToSelect}
          className="flex items-center text-gray-400 hover:text-[#33FFCA] transition-colors font-mono"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Change Companion
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white font-mono">{getCharacterName()}</h1>
          <p className="text-sm text-gray-400 capitalize">{state.mood}</p>
        </div>
        
        <button
          onClick={() => setShowUnlockedVideos(true)}
          className="flex items-center text-gray-400 hover:text-[#FF66B3] transition-colors font-mono"
        >
          <Video className="w-5 h-5 mr-2" />
          Special Moments
        </button>
      </div>

      {/* Character Display */}
      <div className="flex-1 flex items-center justify-center relative p-8">
        {/* Main Character Area */}
        <div className="relative">
          {/* Character Circle */}
          <div className="w-80 h-80 bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-full flex items-center justify-center border-4 border-[#33FFCA]/30 relative overflow-hidden"
               style={{ boxShadow: '0 0 40px rgba(51, 255, 202, 0.2)' }}>
            
            {/* Character Display */}
            <div className="text-center">
              <div className="text-9xl mb-4 animate-pulse">{getMoodEmoji(state.mood)}</div>
              <div className="text-white text-2xl font-bold font-mono">{getCharacterName()}</div>
              <div className="text-[#33FFCA] capitalize font-mono">{state.mood}</div>
            </div>
            
            {/* Rotating border effect */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-[#33FFCA] via-[#FF66B3] to-[#33FFCA] opacity-20 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-4 -right-4 w-3 h-3 bg-[#33FFCA] rounded-full animate-bounce opacity-60" />
          <div className="absolute -bottom-6 -left-6 w-2 h-2 bg-[#FF66B3] rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Stats Panel */}
        <div className="absolute top-8 left-8 bg-[#1A1A28]/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
             style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}>
          <h3 className="text-[#33FFCA] font-semibold mb-4 font-mono">Status</h3>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-center justify-between min-w-[120px]">
              <span className="text-gray-300">🍽️ Hunger:</span>
              <span className={getStatColor(state.hunger)}>{state.hunger}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">⚡ Energy:</span>
              <span className={getStatColor(state.energy)}>{state.energy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">💖 Affection:</span>
              <span className={getStatColor(state.affection)}>{state.affection}%</span>
            </div>
          </div>
          
          {/* Affection Progress */}
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-mono">Bond Level</span>
              <span className="text-[#33FFCA] text-xs font-mono">{state.affectionMilestone}/5</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#33FFCA] to-[#FF66B3] transition-all duration-500"
                style={{ width: `${(state.affectionMilestone / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#12121A] border-t border-gray-800/50 backdrop-blur-sm z-10"
           style={{ boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)' }}>
        <div className="flex justify-around items-center px-6 py-6 max-w-md mx-auto">
          {/* Feed Button */}
          <button
            onClick={handleFeed}
            disabled={Date.now() < state.cooldowns.feed}
            className={`group flex flex-col items-center p-4 w-20 rounded-2xl transition-all duration-300 transform font-mono ${
              Date.now() >= state.cooldowns.feed
                ? 'bg-gradient-to-b from-[#1F1F2A] to-[#0E0E1E] hover:from-[#2C2C40] hover:to-[#1A1A28] hover:scale-105 border-2 border-transparent hover:border-[#FFCA3A]/50 active:scale-95 cursor-pointer'
                : 'bg-gradient-to-b from-[#111] to-[#0A0A0A] border-2 border-gray-800 cursor-not-allowed opacity-50'
            }`}
            style={Date.now() >= state.cooldowns.feed ? { 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            } : {}}
          >
            <div className={`text-3xl mb-2 transition-all duration-300 ${
              Date.now() >= state.cooldowns.feed 
                ? 'group-hover:drop-shadow-[0_0_12px_rgba(255,202,58,0.8)]' 
                : 'grayscale'
            }`}>
              🍲
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              Date.now() >= state.cooldowns.feed ? 'text-white group-hover:text-[#FFCA3A]' : 'text-gray-600'
            }`}>
              Feed
            </span>
            <span className={`text-xs mt-1 ${
              Date.now() >= state.cooldowns.feed ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {getCooldownText(state.cooldowns.feed)}
            </span>
          </button>

          {/* Talk Button */}
          <button
            onClick={handleTalk}
            disabled={Date.now() < state.cooldowns.talk}
            className={`group flex flex-col items-center p-4 w-20 rounded-2xl transition-all duration-300 transform font-mono ${
              Date.now() >= state.cooldowns.talk
                ? 'bg-gradient-to-b from-[#1F1F2A] to-[#0E0E1E] hover:from-[#2C2C40] hover:to-[#1A1A28] hover:scale-105 border-2 border-transparent hover:border-[#8AC6D1]/50 active:scale-95 cursor-pointer'
                : 'bg-gradient-to-b from-[#111] to-[#0A0A0A] border-2 border-gray-800 cursor-not-allowed opacity-50'
            }`}
            style={Date.now() >= state.cooldowns.talk ? { 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            } : {}}
          >
            <div className={`text-3xl mb-2 transition-all duration-300 ${
              Date.now() >= state.cooldowns.talk 
                ? 'group-hover:drop-shadow-[0_0_12px_rgba(138,198,209,0.8)]' 
                : 'grayscale'
            }`}>
              💬
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              Date.now() >= state.cooldowns.talk ? 'text-white group-hover:text-[#8AC6D1]' : 'text-gray-600'
            }`}>
              Talk
            </span>
            <span className={`text-xs mt-1 ${
              Date.now() >= state.cooldowns.talk ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {getCooldownText(state.cooldowns.talk)}
            </span>
          </button>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            disabled={Date.now() < state.cooldowns.play}
            className={`group flex flex-col items-center p-4 w-20 rounded-2xl transition-all duration-300 transform font-mono ${
              Date.now() >= state.cooldowns.play
                ? 'bg-gradient-to-b from-[#1F1F2A] to-[#0E0E1E] hover:from-[#2C2C40] hover:to-[#1A1A28] hover:scale-105 border-2 border-transparent hover:border-[#A0E7E5]/50 active:scale-95 cursor-pointer'
                : 'bg-gradient-to-b from-[#111] to-[#0A0A0A] border-2 border-gray-800 cursor-not-allowed opacity-50'
            }`}
            style={Date.now() >= state.cooldowns.play ? { 
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            } : {}}
          >
            <div className={`text-3xl mb-2 transition-all duration-300 ${
              Date.now() >= state.cooldowns.play 
                ? 'group-hover:drop-shadow-[0_0_12px_rgba(160,231,229,0.8)]' 
                : 'grayscale'
            }`}>
              🎮
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              Date.now() >= state.cooldowns.play ? 'text-white group-hover:text-[#A0E7E5]' : 'text-gray-600'
            }`}>
              Play
            </span>
            <span className={`text-xs mt-1 ${
              Date.now() >= state.cooldowns.play ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {getCooldownText(state.cooldowns.play)}
            </span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {state.mood !== 'neutral' && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-[#1A1A28]/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700/50 font-mono">
          <div className="text-white text-sm text-center">
            {state.mood === 'sad' && `${getCharacterName()} looks hungry and sad...`}
            {state.mood === 'angry' && `${getCharacterName()} seems upset. Maybe give her some attention?`}
            {state.mood === 'needy' && `${getCharacterName()} misses you! She hasn't seen you in a while.`}
            {state.mood === 'sleeping' && `${getCharacterName()} is tired and resting...`}
            {state.mood === 'happy' && `${getCharacterName()} is happy and content! 😊`}
          </div>
        </div>
      )}
    </div>
  );
}