import React, { useState, useEffect, useRef } from 'react';
import { usePearl } from '../../state/pearlStore';

interface Bubble {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  startTime: number;
  duration: number;
  popping: boolean;
  popFrame: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface BubblePopGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BubblePopGame: React.FC<BubblePopGameProps> = ({ isOpen, onClose }) => {
  const { currency } = usePearl();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const bubbleSpawnerRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();

  // Audio context for pop sounds
  const audioContextRef = useRef<AudioContext>();
  const popSoundRef = useRef<AudioBuffer>();

  useEffect(() => {
    if (!isOpen) return;

    // Initialize game
    setTimeLeft(30);
    setScore(0);
    setBubbles([]);
    setParticles([]);
    setGameActive(true);

    // Initialize audio
    initializeAudio();

    // Start bubble spawning
    bubbleSpawnerRef.current = setInterval(() => {
      spawnBubble();
    }, 750); // Every 0.75 seconds

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start animation loop
    startAnimationLoop();

    return () => {
      if (bubbleSpawnerRef.current) clearInterval(bubbleSpawnerRef.current);
      clearInterval(timer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setGameActive(false);
    };
  }, [isOpen]);

  const initializeAudio = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple pop sound using Web Audio API
      const sampleRate = audioContextRef.current.sampleRate;
      const duration = 0.2;
      const buffer = audioContextRef.current.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 10) * 0.3;
      }
      
      popSoundRef.current = buffer;
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  const playPopSound = () => {
    if (audioContextRef.current && popSoundRef.current) {
      try {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = popSoundRef.current;
        source.connect(audioContextRef.current.destination);
        source.start();
      } catch (error) {
        console.log('Sound play failed:', error);
      }
    }
  };

  const getRandomScreenEdge = () => {
    const side = Math.floor(Math.random() * 4);
    const gameArea = gameRef.current?.getBoundingClientRect();
    if (!gameArea) return { x: 0, y: 0 };

    switch (side) {
      case 0: // Top
        return { x: Math.random() * gameArea.width, y: -100 };
      case 1: // Right
        return { x: gameArea.width + 100, y: Math.random() * gameArea.height };
      case 2: // Bottom
        return { x: Math.random() * gameArea.width, y: gameArea.height + 100 };
      case 3: // Left
        return { x: -100, y: Math.random() * gameArea.height };
      default:
        return { x: 0, y: 0 };
    }
  };

  const getRandomScreenOpposite = (startPos: { x: number; y: number }) => {
    const gameArea = gameRef.current?.getBoundingClientRect();
    if (!gameArea) return { x: 0, y: 0 };

    // Move towards opposite side
    if (startPos.x < 0) {
      return { x: gameArea.width + 100, y: Math.random() * gameArea.height };
    } else if (startPos.x > gameArea.width) {
      return { x: -100, y: Math.random() * gameArea.height };
    } else if (startPos.y < 0) {
      return { x: Math.random() * gameArea.width, y: gameArea.height + 100 };
    } else {
      return { x: Math.random() * gameArea.width, y: -100 };
    }
  };

  const spawnBubble = () => {
    if (!gameActive) return;

    const startPos = getRandomScreenEdge();
    const endPos = getRandomScreenOpposite(startPos);
    const duration = 4000 + Math.random() * 3000; // 4-7 seconds
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: startPos.x,
      y: startPos.y,
      targetX: endPos.x,
      targetY: endPos.y,
      size: 80 + Math.random() * 60, // 80-140px
      color: ['#33FFCA', '#FF66B3', '#FFCA3A', '#A855F7', '#10B981'][Math.floor(Math.random() * 5)],
      startTime: Date.now(),
      duration,
      popping: false,
      popFrame: 0
    };

    setBubbles(prev => [...prev, newBubble]);
  };

  const popBubble = (bubbleId: number) => {
    if (!gameActive) return;

    playPopSound();
    
    setBubbles(prev => prev.map(bubble => {
      if (bubble.id === bubbleId && !bubble.popping) {
        // Create particle burst
        createParticleBurst(bubble.x, bubble.y);
        
        setScore(s => s + 1);
        
        return { ...bubble, popping: true, popFrame: 0 };
      }
      return bubble;
    }));
  };

  const createParticleBurst = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6,
        maxLife: 0.6
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const startAnimationLoop = () => {
    const animate = () => {
      if (!gameActive) return;

      const now = Date.now();

      // Update bubbles
      setBubbles(prev => prev.map(bubble => {
        if (bubble.popping) {
          // Animate pop frames
          const newFrame = bubble.popFrame + 0.5;
          if (newFrame >= 6) {
            return null; // Mark for removal
          }
          return { ...bubble, popFrame: newFrame };
        } else {
          // Animate movement
          const elapsed = now - bubble.startTime;
          const progress = Math.min(elapsed / bubble.duration, 1);
          
          // Smooth easing (InOutSine approximation)
          const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
          
          const newX = bubble.x + (bubble.targetX - bubble.x) * easeProgress;
          const newY = bubble.y + (bubble.targetY - bubble.y) * easeProgress;
          
          if (progress >= 1) {
            return null; // Mark for removal
          }
          
          return { ...bubble, x: newX, y: newY };
        }
      }).filter(Boolean) as Bubble[]);

      // Update particles
      setParticles(prev => prev.map(particle => {
        const newLife = particle.life - 0.016; // ~60fps
        if (newLife <= 0) return null;
        
        return {
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // Gravity
          life: newLife
        };
      }).filter(Boolean) as Particle[]);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const endGame = () => {
    setGameActive(false);
    
    // Clear all bubbles and particles
    setBubbles([]);
    setParticles([]);
    
    if (bubbleSpawnerRef.current) {
      clearInterval(bubbleSpawnerRef.current);
    }
    
    // Award currency
    const state = usePearl.getState();
    usePearl.setState({ currency: state.currency + score });
    
    // Show results modal
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showModal', {
        detail: {
          title: "Mini-game over",
          body: `You popped ${score} bubbles and earned ${score} gems!`
        }
      }));
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={gameRef}
      className="fixed inset-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 50%, #312e81 100%)'
      }}
    >
      {/* Game UI */}
      <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-8 z-10">
        {/* Score */}
        <div className="bg-black/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
          <div className="text-white text-3xl font-bold">
            💎 {score}
          </div>
        </div>

        {/* Timer */}
        <div className="bg-black/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
          <div className="text-white text-3xl font-bold">
            ⏰ {timeLeft}
          </div>
        </div>
      </div>

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute cursor-pointer select-none"
          style={{
            left: `${bubble.x - bubble.size/2}px`,
            top: `${bubble.y - bubble.size/2}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.popping ? Math.max(0, 1 - bubble.popFrame / 6) : 1,
            transform: bubble.popping ? `scale(${1 + bubble.popFrame * 0.2})` : 'scale(1)',
            transition: bubble.popping ? 'none' : 'transform 0.1s ease-out'
          }}
          onClick={() => popBubble(bubble.id)}
        >
          {/* Bubble Base */}
          <div
            className="w-full h-full rounded-full relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color}80)`,
              border: `2px solid ${bubble.color}`,
              boxShadow: `0 0 20px ${bubble.color}50, inset 0 0 20px ${bubble.color}30`
            }}
          >
            {/* Highlight */}
            <div 
              className="absolute top-2 left-2 w-4 h-4 bg-white/60 rounded-full blur-sm"
              style={{ width: `${bubble.size * 0.15}px`, height: `${bubble.size * 0.15}px` }}
            />
            
            {/* Pop Animation */}
            {bubble.popping && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="text-white font-bold"
                  style={{ 
                    fontSize: `${bubble.size * 0.3}px`,
                    textShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }}
                >
                  POP!
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.life / particle.maxLife,
            boxShadow: '0 0 6px rgba(255, 255, 0, 0.8)'
          }}
        />
      ))}

      {/* Game Over Overlay */}
      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl p-8 text-center border-2 border-[#33FFCA]/30 max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">Time's Up!</h2>
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-[#33FFCA] text-xl mb-6">
              You popped <span className="font-bold text-2xl">{score}</span> bubbles!
            </p>
            <p className="text-yellow-400 text-lg mb-8">
              Earned <span className="font-bold">{score} 💎</span>
            </p>
            <div className="text-gray-400 text-sm">
              Closing automatically...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};