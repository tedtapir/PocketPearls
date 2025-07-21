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

  const getMoodMessage = () => {
    if (statusFlags.includes('sick')) return "She's not feeling well...";
    if (statusFlags.includes('leavingWarning')) return "She's considering leaving...";
    if (statusFlags.includes('withdrawn')) return "She seems withdrawn today.";
    if (statusFlags.includes('playful')) return "She's in a playful mood!";
    
    switch (mood) {
      case 'happy':
        return "She's feeling great!";
      case 'playful':
        return "She wants to play!";
      case 'neutral':
        return "She's doing okay.";
      case 'low':
        return "She could use some attention.";
      case 'distressed':
        return "She needs your care.";
      default:
        return "How is she feeling?";
    }
  };

  return (
    <div className="pearl-card flex flex-col items-center justify-center h-80 relative overflow-hidden">
      <div className="pearl-glow"></div>
      
      {/* Main Pearl */}
      <div 
        className="w-48 h-48 rounded-full relative flex items-center justify-center pearl-pulse transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${pearlColor}40 40%, ${pearlColor} 70%, #312A45 100%)`,
          boxShadow: `0 0 25px ${pearlColor}80, 0 0 60px ${pearlColor}40`
        }}
      >
        <VideoPlayer
          src={clipPaths}
          className="w-44 h-44 rounded-full overflow-hidden"
          fallbackEmoji={fallbackEmoji}
          loop={true}
          autoPlay={true}
          muted={true}
        />
        
        {/* Mood indicator ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 opacity-60"
          style={{ 
            borderColor: pearlColor,
            animation: mood === 'playful' ? 'spin 8s linear infinite' : 'none'
          }}
        />
      </div>
      
      {/* Status Message */}
      <div className="mt-6 text-center">
        <p className="text-pp-text-dim text-sm mb-2">{getMoodMessage()}</p>
        <div className="flex items-center justify-center gap-4 text-xs text-pp-text-dim">
          <span>Happiness: {Math.round(mood === 'happy' ? 85 : mood === 'neutral' ? 65 : mood === 'low' ? 45 : mood === 'distressed' ? 25 : 75)}</span>
          <span className="capitalize">Mood: {mood}</span>
        </div>
      </div>
      
      {/* Status flags indicator */}
      {statusFlags.length > 0 && (
        <div className="absolute top-4 right-4">
          {statusFlags.map(flag => (
            <div 
              key={flag}
              className={`w-3 h-3 rounded-full mb-1 ${
                flag === 'sick' ? 'bg-pp-error' :
                flag === 'playful' ? 'bg-pp-accent3' :
                flag === 'withdrawn' ? 'bg-pp-warn' :
                'bg-pp-accent1'
              }`}
              title={flag}
            />
          ))}
        </div>
      )}
    </div>
  );
};