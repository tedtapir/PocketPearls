import React, { useMemo } from 'react';
import { usePearl } from '../state/pearlStore';
import { VideoPlayer } from './VideoPlayer';
import { resolveClipSequence, getMoodEmoji } from '../utils/clipResolver';

export const PearlAvatar: React.FC = () => {
  const { mood, statusFlags, bondLevel } = usePearl();
  
  const { clipPaths, fallbackEmoji, pearlColor } = useMemo(() => {
    console.log('Current mood:', mood, 'Status flags:', statusFlags);
    
    // Status flags override mood
    if (statusFlags.includes('sick')) {
      return { 
        clipPaths: resolveClipSequence({ mood, statusFlags }), 
        fallbackEmoji: '😔', 
        pearlColor: '#8B5A5A' 
      };
    }
    if (statusFlags.includes('leavingWarning')) {
      return { 
        clipPaths: resolveClipSequence({ mood, statusFlags }), 
        fallbackEmoji: '😔', 
        pearlColor: '#5A5A8B' 
      };
    }
    
    // Mood-based selection
    const clipPaths = resolveClipSequence({ mood, statusFlags, bondLevel });
    console.log('Selected clip paths:', clipPaths);
    let pearlColor = '#8FD8FF';
    
    switch (mood) {
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
  }, [mood, statusFlags, bondLevel]);

  return (
    <div className="w-full h-full relative overflow-hidden transition-opacity duration-300">
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