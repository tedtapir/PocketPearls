import { create } from 'zustand';
import { resolveClip } from '../utils/clipResolver';

interface PearlStats {
  // Primary visible meters
  hunger: number;        // 0-100
  energy: number;        // 0-100  
  hygiene: number;       // 0-100
  
  // Derived/computed
  happiness: number;     // computed from formula
  mood: 'happy' | 'neutral' | 'low' | 'distressed' | 'playful';
  
  // Hidden progression stats
  affection: number;     // raw points
  trust: number;         // hidden
  comfort: number;       // hidden
  
  // Bond system
  bondLevel: number;     // 0-6
  bondProgress: number;  // 0-100 within current level
  
  // Status flags
  statusFlags: string[]; // ['sick', 'withdrawn', 'playful', 'bondLock', 'leavingWarning']
  
  // Timing
  lastUpdated: number;
  lastInteraction: number;
  dailyAffectionGained: number;
  rareCooldownTimestamp: number;
  
  // Engagement tracking
  engagement: number;    // daily distinct activities
  todayActivities: string[]; // reset daily
  
  // Milestone 2+ features
  unlockedClips: string[];
  currentBackground: string;
  giftCooldown: number;
  romanceEnabled: boolean;
  streakDays: number;
  totalPlayTime: number;
  
  // Analytics
  sessionCount: number;
  lastSessionDate: string;
  activityCounts: Record<string, number>;
}

interface PearlStore extends PearlStats {
  // Core actions
  tick: () => void;
  feed: (foodType?: 'healthy' | 'quick' | 'junk') => ActivityResult;
  talk: (topic: 'light' | 'supportive') => ActivityResult;
  play: () => ActivityResult;
  wash: () => ActivityResult;
  sleepAssist: () => ActivityResult;
  
  // Milestone 2+ actions
  tidy: () => ActivityResult;
  comfort: () => ActivityResult;
  confide: () => ActivityResult;
  giveGift: (giftType: string) => ActivityResult;
  
  // Utility functions
  computeHappiness: () => number;
  computeMood: () => string;
  updateBondProgress: () => void;
  checkStatusFlags: () => void;
  canPerformActivity: (activity: string) => boolean;
  checkRareClipUnlock: () => string | null;
  logActivity: (activity: string) => void;
  
  // Admin
  reset: () => void;
}

interface ActivityResult {
  success: boolean;
  message: string;
  clipPath: string;
  statChanges: Record<string, number>;
}

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

const BOND_THRESHOLDS = [0, 5, 15, 30, 50, 70, 85, 100];
const BOND_TITLES = ['Acquainted', 'Familiar', 'Comfortable', 'Trusted', 'Close', 'Attached', 'Cherished'];

export const usePearl = create<PearlStore>((set, get) => ({
  // Initial state
  hunger: 70,
  energy: 65,
  hygiene: 80,
  happiness: 0,
  mood: 'neutral',
  affection: 0,
  trust: 50,
  comfort: 40,
  bondLevel: 0,
  bondProgress: 0,
  statusFlags: [],
  lastUpdated: Date.now(),
  lastInteraction: Date.now(),
  dailyAffectionGained: 0,
  rareCooldownTimestamp: 0,
  engagement: 0,
  todayActivities: [],
  
  // Milestone 2+ initial state
  unlockedClips: [],
  currentBackground: 'default',
  giftCooldown: 0,
  romanceEnabled: false,
  streakDays: 0,
  totalPlayTime: 0,
  sessionCount: 0,
  lastSessionDate: '',
  activityCounts: {},

  computeHappiness: () => {
    const state = get();
    const recentPositiveEvents = Math.min(state.engagement * 10, 100); // simplified
    return clamp(
      0.35 * state.hunger +
      0.30 * state.energy +
      0.20 * state.hygiene +
      0.15 * recentPositiveEvents
    );
  },

  computeMood: () => {
    const state = get();
    const happiness = state.happiness;
    
    // Priority order from blueprint
    if (state.statusFlags.includes('leavingWarning')) return 'distressed';
    if (state.statusFlags.includes('sick')) return 'low';
    if (happiness < 30) return 'distressed';
    if (happiness < 50) return 'low';
    if (happiness < 75) return 'neutral';
    if (state.statusFlags.includes('playful')) return 'playful';
    return 'happy';
  },

  updateBondProgress: () => {
    const state = get();
    const bondGainMultiplier = 0.4 + (state.trust / 200) + (state.comfort / 250);
    const affectionToBond = Math.min(state.affection * bondGainMultiplier, 12); // daily cap
    
    let newBondProgress = state.bondProgress + affectionToBond;
    let newBondLevel = state.bondLevel;
    
    // Check for level up
    while (newBondLevel < 6 && newBondProgress >= 100) {
      newBondProgress -= 100;
      newBondLevel++;
    }
    
    set({ 
      bondLevel: newBondLevel, 
      bondProgress: clamp(newBondProgress, 0, 100),
      affection: 0 // consumed
    });
  },

  checkStatusFlags: () => {
    const state = get();
    const now = Date.now();
    const hoursSinceInteraction = (now - state.lastInteraction) / (1000 * 60 * 60);
    let newFlags = [...state.statusFlags];

    // Sick: 2 days hygiene <40 OR random low hygiene roll
    if (state.hygiene < 40 && hoursSinceInteraction > 48) {
      if (!newFlags.includes('sick')) newFlags.push('sick');
    } else {
      newFlags = newFlags.filter(f => f !== 'sick');
    }

    // Withdrawn: 24h with <2 activities
    if (hoursSinceInteraction > 24 && state.engagement < 2) {
      if (!newFlags.includes('withdrawn')) newFlags.push('withdrawn');
    } else {
      newFlags = newFlags.filter(f => f !== 'withdrawn');
    }

    // Playful: 2 consecutive days all basics ≥60
    if (state.hunger >= 60 && state.energy >= 60 && state.hygiene >= 60) {
      if (!newFlags.includes('playful')) newFlags.push('playful');
    }

    // Leaving warning: 48h severe neglect
    if (hoursSinceInteraction > 48 && state.hunger < 30 && state.energy < 30 && state.hygiene < 30) {
      if (!newFlags.includes('leavingWarning')) newFlags.push('leavingWarning');
    }

    set({ statusFlags: newFlags });
  },

  checkRareClipUnlock: () => {
    const state = get();
    const now = Date.now();
    
    // Requirements: Engagement ≥3 & no rare clip last 6h & random chance
    if (state.engagement >= 3 && 
        now > state.rareCooldownTimestamp && 
        Math.random() < 0.15) { // 15% chance
      
      const rareClips = [
        '/videos/alexa_neutral_1.mp4.mp4',
        '/videos/alexa_neutral_2.mp4.mp4',
        '/videos/alexa_neutral_3.mp4.mp4',
        '/videos/alexa_neutral_4.mp4.mp4'
      ];
      
      const availableClips = rareClips.filter(clip => !state.unlockedClips.includes(clip));
      if (availableClips.length > 0) {
        const newClip = availableClips[Math.floor(Math.random() * availableClips.length)];
        set({ 
          unlockedClips: [...state.unlockedClips, newClip],
          rareCooldownTimestamp: now + (6 * 60 * 60 * 1000) // 6 hour cooldown
        });
        return newClip;
      }
    }
    return null;
  },

  logActivity: (activity: string) => {
    const state = get();
    const newCounts = { ...state.activityCounts };
    newCounts[activity] = (newCounts[activity] || 0) + 1;
    
    set({ 
      activityCounts: newCounts,
      totalPlayTime: state.totalPlayTime + 1
    });
  },

  canPerformActivity: (activity: string) => {
    const state = get();
    
    switch (activity) {
      case 'play':
        return state.energy >= 25;
      case 'sleepAssist':
        return state.energy < 40;
      case 'tidy':
        return state.energy >= 30;
      default:
        return true;
    }
  },

  tick: () => {
    const now = Date.now();
    const state = get();
    const elapsedHours = (now - state.lastUpdated) / (1000 * 60 * 60);
    
    if (elapsedHours < 0.25) return; // Wait 15 minutes minimum
    
    // Apply decay
    let newHunger = clamp(state.hunger - (2 * elapsedHours));
    let newEnergy = clamp(state.energy - (1 * elapsedHours));
    let newHygiene = clamp(state.hygiene - (1.5 * elapsedHours / 2)); // every 2 hours
    
    // Extra decay if sick
    if (state.statusFlags.includes('sick')) {
      newHunger = clamp(newHunger - (1 * elapsedHours)); // +50% decay
      newEnergy = clamp(newEnergy - (0.5 * elapsedHours)); // +50% decay
    }
    
    // Reset daily tracking if new day
    const lastDay = new Date(state.lastUpdated).getDate();
    const currentDay = new Date(now).getDate();
    const resetDaily = lastDay !== currentDay;
    
    set({
      hunger: newHunger,
      energy: newEnergy,
      hygiene: newHygiene,
      lastUpdated: now,
      dailyAffectionGained: resetDaily ? 0 : state.dailyAffectionGained,
      engagement: resetDaily ? 0 : state.engagement,
      todayActivities: resetDaily ? [] : state.todayActivities
    });
    
    // Recompute derived stats
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    
    set({ happiness, mood });
    
    // Check status changes
    get().checkStatusFlags();
  },

  feed: (foodType = 'healthy') => {
    const state = get();
    const now = Date.now();
    
    // Check rejection conditions
    if (state.hunger > 80 && state.trust < 30 && Math.random() < 0.2) {
      return {
        success: false,
        message: "She's not hungry right now.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'feed', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    // Food type effects
    const effects = {
      healthy: { hunger: 20, affection: 6, comfort: 1 },
      quick: { hunger: 15, affection: 4 },
      junk: { hunger: 10, affection: 3, comfort: -1 }
    };
    
    const effect = effects[foodType];
    const newStats = {
      hunger: clamp(state.hunger + effect.hunger),
      affection: state.affection + effect.affection,
      comfort: clamp(state.comfort + (effect.comfort || 0)),
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + effect.affection
    };
    
    // Track engagement
    if (!state.todayActivities.includes('feed')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'feed'];
    }
    
    set(newStats);
    get().logActivity('feed');
    
    // Update derived stats
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    set({ happiness, mood });
    
    // Check for rare clip unlock
    const rareClip = get().checkRareClipUnlock();
    if (rareClip) {
      // Could trigger notification or modal here
    }
    
    return {
      success: true,
      message: `She enjoyed the ${foodType} meal!`,
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'feed', outcome: 'success' }),
      statChanges: { hunger: effect.hunger, affection: effect.affection }
    };
  },

  talk: (topic: 'light' | 'supportive') => {
    const state = get();
    const now = Date.now();
    
    // Check mood-based rejection
    if (state.mood === 'distressed' && topic === 'light' && Math.random() < 0.3) {
      set({ trust: clamp(state.trust - 1) });
      return {
        success: false,
        message: "She doesn't seem in the mood for light conversation.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'talk', outcome: 'failure' }),
        statChanges: { trust: -1 }
      };
    }
    
    const effects = {
      light: { affection: 5, comfort: 1 },
      supportive: { affection: 8, comfort: 3, trust: 1 }
    };
    
    const effect = effects[topic];
    const newStats = {
      affection: state.affection + effect.affection,
      comfort: clamp(state.comfort + effect.comfort),
      trust: clamp(state.trust + (effect.trust || 0)),
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + effect.affection
    };
    
    // Track engagement
    if (!state.todayActivities.includes('talk')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'talk'];
    }
    
    set(newStats);
    
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    set({ happiness, mood });
    
    return {
      success: true,
      message: `She appreciated your ${topic} conversation.`,
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'talk', outcome: 'success' }),
      statChanges: { affection: effect.affection, comfort: effect.comfort }
    };
  },

  play: () => {
    const state = get();
    const now = Date.now();
    
    if (!get().canPerformActivity('play')) {
      return {
        success: false,
        message: "She's too tired to play right now.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'play', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    // Simple success/fail based on random + mood
    const successChance = state.mood === 'happy' ? 0.8 : 0.6;
    const success = Math.random() < successChance;
    
    if (success) {
      const newStats = {
        affection: state.affection + 10,
        energy: clamp(state.energy - 8),
        happiness: clamp(state.happiness + 5), // temp boost
        lastInteraction: now,
        dailyAffectionGained: state.dailyAffectionGained + 10
      };
      
      if (!state.todayActivities.includes('play')) {
        newStats.engagement = state.engagement + 1;
        newStats.todayActivities = [...state.todayActivities, 'play'];
      }
      
      set(newStats);
      
      return {
        success: true,
        message: "She had fun playing with you!",
        clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'play', outcome: 'success' }),
        statChanges: { affection: 10, energy: -8 }
      };
    } else {
      set({
        affection: state.affection + 4,
        energy: clamp(state.energy - 5),
        lastInteraction: now
      });
      
      return {
        success: false,
        message: "She tried her best, but wasn't quite feeling it.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'play', outcome: 'failure' }),
        statChanges: { affection: 4, energy: -5 }
      };
    }
  },

  wash: () => {
    const state = get();
    const now = Date.now();
    
    if (state.hygiene > 75) {
      set({
        hygiene: clamp(state.hygiene + 10),
        comfort: clamp(state.comfort + 2),
        lastInteraction: now
      });
      
      return {
        success: true,
        message: "She's already quite clean, but appreciated the gesture.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'wash', outcome: 'success' }),
        statChanges: { hygiene: 10, comfort: 2 }
      };
    }
    
    const newStats = {
      hygiene: clamp(state.hygiene + 30),
      comfort: clamp(state.comfort + 4),
      energy: clamp(state.energy - 5),
      affection: state.affection + 6,
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + 6
    };
    
    if (!state.todayActivities.includes('wash')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'wash'];
    }
    
    set(newStats);
    
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    set({ happiness, mood });
    
    return {
      success: true,
      message: "She feels much more refreshed now!",
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'wash', outcome: 'success' }),
      statChanges: { hygiene: 30, comfort: 4, energy: -5 }
    };
  },

  sleepAssist: () => {
    const state = get();
    const now = Date.now();
    
    if (!get().canPerformActivity('sleepAssist')) {
      return {
        success: false,
        message: "She's not tired enough for sleep right now.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags }),
        statChanges: {}
      };
    }
    
    if (state.hunger < 20) {
      return {
        success: false,
        message: "She's too hungry to sleep comfortably.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags }),
        statChanges: {}
      };
    }
    
    const newStats = {
      energy: clamp(state.energy + 40),
      hunger: clamp(state.hunger - 10),
      hygiene: clamp(state.hygiene - 5),
      trust: clamp(state.trust + 3),
      affection: state.affection + 5,
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + 5
    };
    
    if (!state.todayActivities.includes('sleep')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'sleep'];
    }
    
    set(newStats);
    
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    set({ happiness, mood });
    
    return {
      success: true,
      message: "She's settling in for a good rest.",
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'sleep', outcome: 'success' }),
      statChanges: { energy: 40, trust: 3, hunger: -10 }
    };
  },

  tidy: () => {
    const state = get();
    const now = Date.now();
    
    if (state.energy < 30) {
      return {
        success: false,
        message: "She's too tired to tidy up right now.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'tidy', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    const newStats = {
      happiness: clamp(state.happiness + 5), // temp boost
      trust: clamp(state.trust + 2),
      affection: state.affection + 6,
      energy: clamp(state.energy - 8),
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + 6
    };
    
    if (!state.todayActivities.includes('tidy')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'tidy'];
    }
    
    set(newStats);
    get().logActivity('tidy');
    
    const happiness = get().computeHappiness();
    const mood = get().computeMood();
    set({ happiness, mood });
    
    return {
      success: true,
      message: "She feels better with a tidy space!",
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'tidy', outcome: 'success' }),
      statChanges: { trust: 2, affection: 6, energy: -8 }
    };
  },

  comfort: () => {
    const state = get();
    const now = Date.now();
    
    if (state.mood !== 'low' && state.mood !== 'distressed') {
      return {
        success: false,
        message: "She seems okay right now.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'comfort', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    // Choose comfort approach based on mood
    const approach = Math.random() < 0.7 ? 'gentle' : 'encouraging';
    const success = approach === 'gentle' || state.trust > 60;
    
    if (success) {
      const newStats = {
        trust: clamp(state.trust + 4),
        comfort: clamp(state.comfort + 6),
        affection: state.affection + 5,
        lastInteraction: now,
        dailyAffectionGained: state.dailyAffectionGained + 5
      };
      
      if (!state.todayActivities.includes('comfort')) {
        newStats.engagement = state.engagement + 1;
        newStats.todayActivities = [...state.todayActivities, 'comfort'];
      }
      
      set(newStats);
      get().logActivity('comfort');
      
      return {
        success: true,
        message: "Your comfort helped her feel better.",
        clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'comfort', outcome: 'success' }),
        statChanges: { trust: 4, comfort: 6, affection: 5 }
      };
    } else {
      set({
        comfort: clamp(state.comfort - 3),
        lastInteraction: now
      });
      
      return {
        success: false,
        message: "She needed a different kind of support.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'comfort', outcome: 'failure' }),
        statChanges: { comfort: -3 }
      };
    }
  },

  confide: () => {
    const state = get();
    const now = Date.now();
    
    if (state.bondLevel < 3) {
      return {
        success: false,
        message: "She's not ready to share personal things yet.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'confide', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    // Story fragments based on bond level
    const stories = [
      { level: 3, message: "She shares a childhood memory.", trust: 8, comfort: 4 },
      { level: 4, message: "She talks about her dreams.", trust: 10, comfort: 6 },
      { level: 5, message: "She opens up about her fears.", trust: 12, comfort: 8 },
      { level: 6, message: "She shares her deepest thoughts.", trust: 15, comfort: 10 }
    ];
    
    const availableStories = stories.filter(s => s.level <= state.bondLevel);
    const story = availableStories[availableStories.length - 1];
    
    const newStats = {
      trust: clamp(state.trust + story.trust),
      comfort: clamp(state.comfort + story.comfort),
      affection: state.affection + 8,
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + 8
    };
    
    if (!state.todayActivities.includes('confide')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'confide'];
    }
    
    set(newStats);
    get().logActivity('confide');
    
    return {
      success: true,
      message: story.message,
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'confide', outcome: 'success' }),
      statChanges: { trust: story.trust, comfort: story.comfort, affection: 8 }
    };
  },

  giveGift: (giftType: string) => {
    const state = get();
    const now = Date.now();
    
    if (now < state.giftCooldown) {
      return {
        success: false,
        message: "She's still appreciating your last gift.",
        clipPath: resolveClip({ mood: state.mood, statusFlags: state.statusFlags, activity: 'gift', outcome: 'failure' }),
        statChanges: {}
      };
    }
    
    const gifts = {
      book: { affection: 8, comfort: 3, message: "She loves the book you chose!" },
      tea: { affection: 6, comfort: 5, message: "The tea smells wonderful to her." },
      flower: { affection: 10, comfort: 2, message: "She's touched by the beautiful flower." },
      music: { affection: 7, comfort: 4, message: "The music brings her joy." }
    };
    
    const gift = gifts[giftType as keyof typeof gifts] || gifts.flower;
    const bondMultiplier = 1 + (state.bondLevel * 0.2);
    const finalAffection = Math.round(gift.affection * bondMultiplier);
    
    const newStats = {
      affection: state.affection + finalAffection,
      comfort: clamp(state.comfort + gift.comfort),
      giftCooldown: now + (24 * 60 * 60 * 1000), // 24 hour cooldown
      lastInteraction: now,
      dailyAffectionGained: state.dailyAffectionGained + finalAffection
    };
    
    if (!state.todayActivities.includes('gift')) {
      newStats.engagement = state.engagement + 1;
      newStats.todayActivities = [...state.todayActivities, 'gift'];
    }
    
    set(newStats);
    get().logActivity('gift');
    
    return {
      success: true,
      message: gift.message,
      clipPath: resolveClip({ mood: get().mood, statusFlags: get().statusFlags, activity: 'gift', outcome: 'success' }),
      statChanges: { affection: finalAffection, comfort: gift.comfort }
    };
  },

  reset: () => set({
    hunger: 70,
    energy: 65,
    hygiene: 80,
    happiness: 0,
    mood: 'neutral',
    affection: 0,
    trust: 50,
    comfort: 40,
    bondLevel: 0,
    bondProgress: 0,
    statusFlags: [],
    lastUpdated: Date.now(),
    lastInteraction: Date.now(),
    dailyAffectionGained: 0,
    rareCooldownTimestamp: 0,
    engagement: 0,
    todayActivities: []
  })
}));