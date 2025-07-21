import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CompanionState, CompanionAction } from '../types/companion';

const initialState: CompanionState = {
  characterID: null,
  mood: 'neutral',
  hunger: 80,
  energy: 70,
  affection: 50,
  lastInteractionTime: Date.now(),
  cooldowns: {
    feed: 0,
    talk: 0,
    play: 0
  }
};

function companionReducer(state: CompanionState, action: CompanionAction): CompanionState {
  const now = Date.now();
  
  switch (action.type) {
    case 'FEED':
      if (now < state.cooldowns.feed) return state;
      
      return {
        ...state,
        hunger: Math.min(100, state.hunger + 20),
        affection: Math.min(100, state.affection + 5),
        lastInteractionTime: now,
        cooldowns: {
          ...state.cooldowns,
          feed: now + (60 * 60 * 1000) // 1 hour cooldown
        }
      };
    
    case 'TALK':
      if (now < state.cooldowns.talk) return state;
      
      return {
        ...state,
        affection: Math.min(100, state.affection + 10),
        lastInteractionTime: now,
        cooldowns: {
          ...state.cooldowns,
          talk: now + (60 * 60 * 1000) // 1 hour cooldown
        }
      };
    
    case 'PLAY':
      if (now < state.cooldowns.play) return state;
      
      return {
        ...state,
        energy: Math.max(0, state.energy - 10),
        affection: Math.min(100, state.affection + 15),
        lastInteractionTime: now,
        cooldowns: {
          ...state.cooldowns,
          play: now + (2 * 60 * 60 * 1000) // 2 hour cooldown
        }
      };
    
    case 'TICK':
      const timeSinceLastInteraction = now - state.lastInteractionTime;
      
      let newMood = state.mood;
      const newHunger = Math.max(0, state.hunger - 2);
      const newEnergy = Math.max(0, state.energy - 1);
      const newAffection = Math.max(0, state.affection - 1);
      
      // Determine mood based on stats
      if (newHunger < 30) {
        newMood = 'sad';
      } else if (newAffection < 20) {
        newMood = 'angry';
      } else if (timeSinceLastInteraction > 6 * 60 * 60 * 1000) { // 6 hours
        newMood = 'needy';
      } else if (newEnergy < 15) {
        newMood = 'sleeping';
      } else if (newAffection > 80 && newHunger > 70) {
        newMood = 'happy';
      } else {
        newMood = 'neutral';
      }
      
      return {
        ...state,
        hunger: newHunger,
        energy: newEnergy,
        affection: newAffection,
        mood: newMood
      };
    
    case 'SET_MOOD':
      return {
        ...state,
        mood: action.payload
      };
    
    case 'SET_CHARACTER':
      return {
        ...state,
        characterID: action.payload
      };
    
    default:
      return state;
  }
}

const CompanionContext = createContext<{
  state: CompanionState;
  dispatch: React.Dispatch<CompanionAction>;
} | null>(null);

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(companionReducer, initialState);

  // Game tick every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CompanionContext.Provider value={{ state, dispatch }}>
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within a CompanionProvider');
  }
  return context;
}