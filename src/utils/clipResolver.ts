interface ClipResolverParams {
  mood: string;
  statusFlags: string[];
  activity?: string;
  outcome?: 'success' | 'failure' | 'neutral';
  bondLevel?: number;
}

// Map your video files to these paths
const CLIP_PATHS = {
  // Idle clips based on mood
  idle: {
    happy: [
      '/videos/alexa_neutral_1.mp4',
      '/videos/alexa_neutral_2.mp4'
    ],
    neutral: [
      '/videos/pearl_idle_1.mp4',
      '/videos/alexa_neutral_3.mp4'
    ],
    low: [
      '/videos/pearl_sad_1.mp4',
      '/videos/alexa_neutral_4.mp4'
    ],
    distressed: [
      '/videos/pearl_sad_1.mp4',
      '/videos/pearl_neglected_1.mp4'
    ],
    playful: [
      '/videos/alexa_neutral_1.mp4',
      '/videos/alexa_neutral_2.mp4'
    ]
  },
  
  // Activity-specific clips
  activities: {
    feed: {
      success: [
        '/videos/eat_accept_1.mp4.mp4'
      ],
      failure: [
        '/videos/pearl_sad_1.mp4'
      ],
      healthy: [
        '/videos/healthy_meal_1.mp4'
      ],
      quick: [
        '/videos/quick_snack_1.mp4'
      ],
      junk: [
        '/videos/comfort_food_1.mp4'
      ]
    },
    talk: {
      success: [
        '/videos/alexa_neutral_1.mp4',
        '/videos/alexa_neutral_3.mp4'
      ],
      failure: [
        '/videos/alexa_neutral_4.mp4'
      ]
    },
    play: {
      game: [
        '/videos/play_start_1.mp4.mp4',
        '/videos/alexa_neutral_1.mp4'
      ],
      friend: [
        '/videos/play_with_friend_1.mp4',
        '/videos/alexa_neutral_2.mp4'
      ],
      success: [
        '/videos/play_start_1.mp4.mp4',
        '/videos/alexa_neutral_1.mp4',
        '/videos/alexa_neutral_2.mp4'
      ],
      failure: [
        '/videos/alexa_neutral_3.mp4'
      ]
    },
    wash: {
      success: [
        '/videos/wash_start_1.mp4',
        '/videos/alexa_neutral_1.mp4'
      ]
    },
    sleep: {
      settling: [
        '/videos/sleep_settling_1.mp4.mp4',
        '/videos/alexa_neutral_2.mp4'
      ],
      sleeping: [
        '/videos/alexa_neutral_2.mp4',
        '/videos/alexa_neutral_4.mp4'
      ],
      wake: [
        '/videos/alexa_neutral_1.mp4'
      ]
    },
    tidy: {
      before: [
        '/videos/tidy_before_1.mp4',
        '/videos/alexa_neutral_3.mp4'
      ],
      success: [
        '/videos/alexa_neutral_1.mp4',
        '/videos/alexa_neutral_2.mp4'
      ],
      failure: [
        '/videos/alexa_neutral_3.mp4'
      ]
    },
    comfort: {
      success: [
        '/videos/alexa_neutral_1.mp4',
        '/videos/alexa_neutral_2.mp4'
      ],
      failure: [
        '/videos/alexa_neutral_4.mp4'
      ]
    },
    confide: {
      success: [
        '/videos/alexa_neutral_1.mp4',
        '/videos/alexa_neutral_3.mp4'
      ]
    },
    gift: {
      success: [
        '/videos/alexa_neutral_1.mp4'
      ],
      failure: [
        '/videos/alexa_neutral_2.mp4'
      ]
    }
  },
  
  // Status-specific clips
  status: {
    sick: [
      '/videos/pearl_sick_idle_1.mp4',
      '/videos/sick_1.mp4.mp4'
    ],
    angry: [
      '/videos/Pearl_Angry_1.mp4',
      '/videos/alexa_neutral_4.mp4'
    ],
    neglected: [
      '/videos/pearl_neglected_1.mp4',
      '/videos/pearl_sad_1.mp4'
    ],
    sad: [
      '/videos/pearl_sad_1.mp4',
      '/videos/alexa_neutral_4.mp4'
    ],
    leaving: [
      '/videos/pearl_neglected_1.mp4',
      '/videos/pearl_sad_1.mp4'
    ]
  },
  
  // Rare/special clips
  rare: [
    '/videos/alexa_neutral_1.mp4',
    '/videos/alexa_neutral_2.mp4',
    '/videos/alexa_neutral_3.mp4',
    '/videos/alexa_neutral_4.mp4'
  ],
  
  // Milestone clips
  milestones: [
    '/videos/alexa_neutral_1.mp4',
    '/videos/alexa_neutral_2.mp4'
  ]
};

export function resolveClip({ mood, statusFlags, activity, outcome, bondLevel }: ClipResolverParams): string {
  // Priority 1: Status flags override everything
  if (statusFlags.includes('neglected')) {
    return getRandomClip(CLIP_PATHS.status.neglected) as string;
  }
  
  if (statusFlags.includes('angry')) {
    return getRandomClip(CLIP_PATHS.status.angry) as string;
  }
  
  if (statusFlags.includes('sick')) {
    return getRandomClip(CLIP_PATHS.status.sick) as string;
  }
  
  if (statusFlags.includes('sad')) {
    return getRandomClip(CLIP_PATHS.status.sad) as string;
  }
  
  if (statusFlags.includes('leavingWarning')) {
    return getRandomClip(CLIP_PATHS.status.leaving) as string;
  }
  
  // Priority 2: Activity-specific clips
  if (activity && outcome) {
    const activityClips = CLIP_PATHS.activities[activity as keyof typeof CLIP_PATHS.activities];
    if (activityClips && activityClips[outcome as keyof typeof activityClips]) {
      return getRandomClip(activityClips[outcome as keyof typeof activityClips]) as string;
    }
  }
  
  // Priority 3: Mood-based idle clips
  if (statusFlags.includes('playful')) {
    return getRandomClip(CLIP_PATHS.idle.playful) as string;
  }
  
  const moodClips = CLIP_PATHS.idle[mood as keyof typeof CLIP_PATHS.idle];
  if (moodClips) {
    return getRandomClip(moodClips) as string;
  }
  
  // Fallback to neutral
  return getRandomClip(CLIP_PATHS.idle.neutral) as string;
}

// New function to get all clips for seamless playback
export function resolveClipSequence({ mood, statusFlags, activity, outcome, bondLevel }: ClipResolverParams): string[] {
  // Priority 1: Status flags override everything
  if (statusFlags.includes('neglected')) {
    return CLIP_PATHS.status.neglected;
  }
  
  if (statusFlags.includes('angry')) {
    return CLIP_PATHS.status.angry;
  }
  
  if (statusFlags.includes('sick')) {
    return CLIP_PATHS.status.sick;
  }
  
  if (statusFlags.includes('sad')) {
    return CLIP_PATHS.status.sad;
  }
  
  if (statusFlags.includes('leavingWarning')) {
    return CLIP_PATHS.status.leaving;
  }
  
  // Priority 2: Activity-specific clips
  if (activity && outcome) {
    const activityClips = CLIP_PATHS.activities[activity as keyof typeof CLIP_PATHS.activities];
    if (activityClips && activityClips[outcome as keyof typeof activityClips]) {
      return activityClips[outcome as keyof typeof activityClips];
    }
  }
  
  // Special handling for play activity with playType
  if (activity === 'play' && outcome) {
    const playClips = CLIP_PATHS.activities.play;
    if (playClips && playClips[outcome as keyof typeof playClips]) {
      return playClips[outcome as keyof typeof playClips];
    }
  }
  
  // Priority 3: Mood-based idle clips
  if (statusFlags.includes('playful')) {
    return CLIP_PATHS.idle.playful;
  }
  
  const moodClips = CLIP_PATHS.idle[mood as keyof typeof CLIP_PATHS.idle];
  if (moodClips) {
    return moodClips;
  }
  
  // Fallback to neutral
  return CLIP_PATHS.idle.neutral;
}

function getRandomClip(clips: string[]): string | string[] {
  return clips[Math.floor(Math.random() * clips.length)];
}

export function getRareClip(): string {
  return getRandomClip(CLIP_PATHS.rare);
}

export function getMilestoneClip(): string {
  return getRandomClip(CLIP_PATHS.milestones);
}

// Helper function to get mood-based fallback emoji
export function getMoodEmoji(mood: string): string {
  switch (mood) {
    case 'happy': return '😊';
    case 'playful': return '😄';
    case 'neutral': return '🙂';
    case 'low': return '😐';
    case 'distressed': return '😢';
    default: return '😐';
  }
}