import React, { useState, useEffect, useRef } from 'react';
import { usePearl } from '../../state/pearlStore';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

interface BubblePopGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BubblePopGame: React.FC<BubblePopGameProps> = ({ isOpen, onClose }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnerRef = useRef<NodeJS.Timeout | null>(null);

  // Start game when opened
  useEffect(() => {
    if (isOpen && !gameActive && !gameOver) {
      startGame();
    }
    
    // Cleanup on close
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (spawnerRef.current) {
      clearInterval(spawnerRef.current);
      spawnerRef.current = null;
    }
    setGameActive(false);
    setBubbles([]);
  };

  const startGame = () => {
    console.log('Starting bubble pop game...');
    cleanup(); // Clean up any existing timers
    
    setTimeLeft(30);
    setScore(0);
    setBubbles([]);
    setGameActive(true);
    setGameOver(false);

    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn bubbles every 0.75 seconds
    spawnerRef.current = setInterval(() => {
      spawnBubble();
    }, 750);
    
    // Spawn first bubble immediately
    spawnBubble();
  };

  const spawnBubble = () => {
    console.log('Spawning bubble...');
    if (!gameAreaRef.current) {
      console.log('No game area ref');
      return;
    }

    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const size = 80 + Math.random() * 60; // 80-140px
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - size),
      y: Math.random() * (window.innerHeight - 200) + 100, // Avoid UI areas
      size,
      color: ['#33FFCA', '#FF66B3', '#FFCA3A', '#A855F7', '#10B981'][Math.floor(Math.random() * 5)],
      popped: false
    };

    console.log('Created bubble:', newBubble);
    setBubbles(prev => [...prev, newBubble]);

    // Remove bubble after 4-7 seconds if not popped
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
    }, 4000 + Math.random() * 3000);
  };

  const popBubble = (bubbleId: number) => {
    console.log('Popping bubble:', bubbleId);
    setBubbles(prev => prev.map(bubble => {
      if (bubble.id === bubbleId && !bubble.popped) {
        setScore(s => s + 1);
        return { ...bubble, popped: true };
      }
      return bubble;
    }));

    // Remove popped bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    }, 300);
  };

  const endGame = () => {
    console.log('Ending game with score:', score);
    cleanup();
    setGameActive(false);
    setGameOver(true);

    // Award currency
    const state = usePearl.getState();
    usePearl.setState({ currency: state.currency + score });

    // Show results after a moment
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showModal', {
        detail: {
          title: "Mini-game over",
          body: `You popped ${score} bubbles and earned ${score} gems!`
        }
      }));
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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

      {/* Game Area */}
      <div ref={gameAreaRef} className="absolute inset-0 pt-24 pb-8 overflow-hidden">
        {/* Bubbles */}
        {console.log('Rendering bubbles:', bubbles.length)}
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className={`absolute cursor-pointer select-none transition-all duration-300 ${
              bubble.popped ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            } z-10`}
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            onClick={() => !bubble.popped && popBubble(bubble.id)}
          >
            {/* Bubble */}
            <div
              className="w-full h-full rounded-full relative"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color}80)`,
                border: `3px solid ${bubble.color}`,
                boxShadow: `0 0 20px ${bubble.color}50`
              }}
            >
              {/* Highlight */}
              <div 
                className="absolute top-2 left-2 bg-white/60 rounded-full"
                style={{ 
                  width: `${bubble.size * 0.15}px`, 
                  height: `${bubble.size * 0.15}px` 
                }}
              />
              
              {/* Pop text */}
              {bubble.popped && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-white font-bold"
                    style={{ fontSize: `${bubble.size * 0.3}px` }}
                  >
                    POP!
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Game Over Screen */}
      {gameOver && (
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