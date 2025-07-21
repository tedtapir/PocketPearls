import React from 'react';
import { useCompanion } from '../context/CompanionContext';

const characters = [
  { id: 0, name: 'Suze', description: 'Gentle and introspective', emoji: '😔' },
  { id: 1, name: 'Jules', description: 'Energetic and playful', emoji: '😊' },
  { id: 2, name: 'Mina', description: 'Artistic and dreamy', emoji: '🎨' },
  { id: 3, name: 'Theo', description: 'Calm and thoughtful', emoji: '🤔' },
  { id: 4, name: 'Alex', description: 'Adventurous and bold', emoji: '🌟' }
];

interface CharacterSelectProps {
  onCharacterSelect: (characterId: number) => void;
}

export function CharacterSelect({ onCharacterSelect }: CharacterSelectProps) {
  const { dispatch } = useCompanion();

  const handleSelect = (characterId: number) => {
    dispatch({ type: 'SET_CHARACTER', payload: characterId });
    onCharacterSelect(characterId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] flex flex-col items-center justify-center p-12 font-mono relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent opacity-60 animate-pulse" style={{ zIndex: -1 }} />
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-[#33FFCA] mb-4" style={{ 
          textShadow: '0 0 20px rgba(51, 255, 202, 0.4)' 
        }}>
          Choose Your Companion
        </h1>
        <p className="text-gray-400 text-lg">Each companion has a unique personality and emotional journey</p>
      </div>
      
      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-6">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleSelect(character.id)}
            className="group relative bg-gradient-to-b from-[#1A1A28] to-[#101018] rounded-[20px] border-2 border-transparent p-6 w-full max-w-[280px] mx-auto cursor-pointer transition-all duration-300 hover:border-[#33FFCA] hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(51,255,202,0.3)]"
            style={{ 
              boxShadow: '0 0 20px rgba(51, 255, 202, 0.08)' 
            }}
          >
            {/* Character Preview */}
            <div className="aspect-square bg-[#1A1A28] rounded-xl mb-6 flex items-center justify-center relative overflow-hidden border border-gray-700/50">
              {/* Video placeholder - ready for actual video integration */}
              <div className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                {character.emoji}
              </div>
              
              {/* Subtle scan line effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#33FFCA]/5 to-transparent animate-pulse" />
              
              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-[#33FFCA] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Character Info */}
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold text-white group-hover:text-[#33FFCA] transition-colors">
                {character.name}
              </h3>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                {character.description}
              </p>
              
              {/* Select Button */}
              <button className="w-full mt-4 bg-[#33FFCA] hover:bg-[#2DDDB3] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#33FFCA] focus:ring-opacity-50">
                Select
              </button>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-[#33FFCA]/10 to-[#FF66B3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Build meaningful connections through care and attention
        </p>
      </div>
    </div>
  );
}