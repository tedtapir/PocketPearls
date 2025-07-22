import React, { useMemo } from 'react';
import { usePearl } from '../state/pearlStore';
import { VideoPlayer } from './VideoPlayer';
import { resolveClipSequence, getMoodEmoji } from '../utils/clipResolver';

export const PearlAvatar: React.FC = () => {
  const { mood, statusFlags, bondLevel, hunger, energy, hygiene } = usePearl();
  
  const { clipPaths, fallbackEmoji, pearlColor } = useMemo(() => {
    console.log('Current mood:', mood, 'Status flags:', statusFlags);
    
    // Don't show sad videos if Pearl just got fed and has good hunger
    let effectiveMood = mood;
    if (mood === 'low' && hunger > 60) {
      effectiveMood = 'neutral';
    }
    if (mood === 'distressed' && hunger > 60 && energy > 40) {
      effectiveMood = 'neutral';
    }
    
    // Status flags override mood
    if (statusFlags.includes('sick')) {
      return { 
        clipPaths: resolveClipSequence({ mood: effectiveMood, statusFlags }), 
        fallbackEmoji: '😔', 
        pearlColor: '#8B5A5A' 
      };
    }
    if (statusFlags.includes('leavingWarning')) {
      return { 
        clipPaths: resolveClipSequence({ mood: effectiveMood, statusFlags }), 
        fallbackEmoji: '😔', 
        pearlColor: '#5A5A8B' 
      };
    }
    
    // Mood-based selection
    const clipPaths = resolveClipSequence({ mood: effectiveMood, statusFlags, bondLevel });
    console.log('Selected clip paths:', clipPaths);
    let pearlColor = '#8FD8FF';
    
    switch (effectiveMood) {
      case 'happy':
        pearlColor = '#B89CFF';
        break;
      case 'playful':
        pearlColor = '#FF9FD6';
        break;
      case 'neutral':
        pearlColor = '#8FD8FF';
        break;
      case 'low':
        pearlColor = '#9AA6B2';
        break;
      case 'distressed':
        pearlColor = '#FF5F56';
        break;
    }
    
    return { 
      clipPaths, 
      fallbackEmoji: '😊', 
      pearlColor 
    };
  }, [mood, statusFlags, bondLevel, hunger, energy, hygiene]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <VideoPlayer
        src={clipPaths}
        className="w-full h-full object-cover object-center"
        fallbackEmoji={fallbackEmoji}
        loop={true}
        autoPlay={true}
        muted={true}
      />
    </div>
  );
};