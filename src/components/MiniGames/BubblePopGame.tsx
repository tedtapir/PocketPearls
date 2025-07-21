import React, { useState, useEffect } from 'react';
import { usePearl } from '../../state/pearlStore';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface BubblePopGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BubblePopGame: React.FC<BubblePopGameProps> = ({ isOpen, onClose }) => {
  const { currency } = usePearl();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize game
    setTimeLeft(30);
    setScore(0);
    generateBubbles();

    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onClose();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bubble generation
    const bubbleGenerator = setInterval(() => {
      if (bubbles.length < 8) {
        generateBubbles();
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(bubbleGenerator);
    };
  }, [isOpen]);

  const generateBubbles = () => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 3; i++) {
      newBubbles.push({
        id: Date.now() + i,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: Math.random() * 70 + 15, // 15-85% of screen height
        size: Math.random() * 40 + 30, // 30-70px
        color: ['#33FFCA', '#FF66B3', '#FFCA3A', '#A855F7'][Math.floor(Math.random() * 4)]
      });
    }
    setBubbles(prev => [...prev, ...newBubbles]);
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
    
    // Add currency
    const state = usePearl.getState();
    usePearl.setState({ currency: state.currency + 1 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Game UI */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
          <div className="text-white text-2xl font-bold mb-2">Bubble Pop!</div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-[#33FFCA]">
              <span className="text-lg">⏰</span>
              <span className="ml-2 font-bold">{timeLeft}s</span>
            </div>
            <div className="text-yellow-400">
              <span className="text-lg">💎</span>
              <span className="ml-2 font-bold">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute cursor-pointer animate-bounce"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${bubble.color}50`,
            animation: `bounce 2s infinite, float-${bubble.id % 3} 3s infinite`
          }}
          onClick={() => popBubble(bubble.id)}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        </div>
      ))}

      {/* Game Over */}
      {timeLeft === 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gradient-to-br from-[#1A1A28] to-[#101018] rounded-3xl p-8 text-center border-2 border-[#33FFCA]/30">
            <h2 className="text-3xl font-bold text-white mb-4">Time's Up!</h2>
            <p className="text-[#33FFCA] text-xl mb-6">
              You earned <span className="font-bold">{score} 💎</span>
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#33FFCA] to-[#2DDDB3] text-black font-bold py-3 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};