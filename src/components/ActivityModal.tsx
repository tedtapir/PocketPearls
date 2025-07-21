import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ActivityModalProps {
  activity: 'feed' | 'talk' | 'play' | 'wash' | 'sleep' | 'tidy' | 'comfort' | 'confide' | 'gift' | 'medicine' | null;
  onClose: () => void;
  onConfirm: (options?: any) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose, onConfirm }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  if (!activity) return null;

  const handleConfirm = () => {
    switch (activity) {
      case 'feed':
        onConfirm(selectedOption || 'healthy');
        break;
      case 'talk':
        onConfirm(selectedOption || 'light');
        break;
      case 'play':
        onConfirm(selectedOption || 'game');
        break;
      default:
        onConfirm();
    }
    onClose();
  };

  const renderContent = () => {
    switch (activity) {
      case 'feed':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">What should she eat?</h3>
            <div className="space-y-2">
              {[
                { id: 'healthy', label: 'Healthy Meal', desc: 'Nutritious and filling' },
                { id: 'quick', label: 'Quick Snack', desc: 'Fast but less satisfying' },
                { id: 'junk', label: 'Comfort Food', desc: 'Tasty but not ideal' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-pp-accent1 bg-pp-accent1/10'
                      : 'border-gray-600 hover:border-pp-accent1/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'talk':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">What would you like to talk about?</h3>
            <div className="space-y-2">
              {[
                { id: 'light', label: 'Light Chat', desc: 'Casual conversation' },
                { id: 'supportive', label: 'Check In', desc: 'See how she\'s feeling' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-pp-accent1 bg-pp-accent1/10'
                      : 'border-gray-600 hover:border-pp-accent1/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'play':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Play Time!</h3>
            <div className="space-y-2">
              {[
                { id: 'game', label: 'Play Game', desc: '' },
                { id: 'friend', label: 'Play with Friend', desc: '' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-pp-accent1 bg-pp-accent1/10'
                      : 'border-gray-600 hover:border-pp-accent1/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{option.label}</div>
                    {option.desc && <div className="text-sm text-gray-400">{option.desc}</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'wash':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Help her freshen up</h3>
            <p className="text-gray-300">A quick wash will help her feel better</p>
            <div className="bg-pp-surface p-6 rounded-lg border border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">🚿</div>
                <p className="text-sm text-gray-400">Wash sequence placeholder</p>
              </div>
            </div>
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Help her rest</h3>
            <p className="text-gray-300">She looks tired. A good rest will restore her energy.</p>
            <div className="bg-pp-surface p-6 rounded-lg border border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">😴</div>
                <p className="text-sm text-gray-400">Help her settle in for sleep</p>
              </div>
            </div>
          </div>
        );

      case 'tidy':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Tidy Up Together</h3>
            <p className="text-gray-300">Help organize the space for a calmer environment</p>
            <div className="bg-pp-surface p-6 rounded-lg border border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">🧹</div>
                <p className="text-sm text-gray-400">Drag items to organize</p>
              </div>
            </div>
          </div>
        );

      case 'comfort':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Offer Comfort</h3>
            <p className="text-gray-300">She seems like she could use some emotional support</p>
            <div className="bg-pp-surface p-6 rounded-lg border border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">🤗</div>
                <p className="text-sm text-gray-400">Gentle presence and understanding</p>
              </div>
            </div>
          </div>
        );

      case 'confide':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Listen & Share</h3>
            <p className="text-gray-300">Create space for deeper conversation</p>
            <div className="bg-pp-surface p-6 rounded-lg border border-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-4">💭</div>
                <p className="text-sm text-gray-400">Personal stories and thoughts</p>
              </div>
            </div>
          </div>
        );

      case 'gift':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold gradient-text">Choose a Gift</h3>
            <div className="space-y-2">
              {[
                { id: 'book', label: 'Book', desc: 'A thoughtful read' },
                { id: 'tea', label: 'Tea', desc: 'Calming and warm' },
                { id: 'flower', label: 'Flower', desc: 'Beautiful and delicate' },
                { id: 'music', label: 'Music', desc: 'A meaningful song' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-pp-accent1 bg-pp-accent1/10'
                      : 'border-gray-600 hover:border-pp-accent1/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="pearl-card max-w-md w-full">
        <div className="pearl-glow"></div>
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          {renderContent()}
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 pp-btn"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 pp-btn primary"
              disabled={activity === 'feed' || activity === 'talk' || activity === 'play' ? !selectedOption : false}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};