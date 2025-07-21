export interface CompanionState {
  characterID: number | null;
  mood: 'neutral' | 'happy' | 'sad' | 'needy' | 'angry' | 'sleeping';
  hunger: number;        // 0-100
  energy: number;        // 0-100
  affection: number;     // 0-100
  lastInteractionTime: number;
  cooldowns: {
    feed: number;
    talk: number;
    play: number;
  };
}

export interface CompanionAction {
  type: 'FEED' | 'TALK' | 'PLAY' | 'TICK' | 'SET_MOOD' | 'SET_CHARACTER';
  payload?: any;
}