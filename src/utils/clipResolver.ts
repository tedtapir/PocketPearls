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
      '/videos/idle_neutral_1.mp4',
      '/videos/idle_neutral_2.mp4',
      '/videos/idle_neutral_3.mp4',
      '/videos/idle_neutral_4.mp4'
    ],
    neutral: [
      '/videos/idle_neutral_1.mp4',
      '/videos/idle_neutral_2.mp4',
      '/videos/idle_neutral_3.mp4',
      '/videos/idle_neutral_4.mp4'
    ],
    low: [
      '/videos/idle_neutral_1.mp4',
      '/videos/idle_neutral_2.mp4'
    ],
    distressed: [
      '/videos/idle_neutral_1.mp4',
      '/videos/idle_neutral_2.mp4'
    ],
    playful: [
      '/videos/idle_neutral_1.mp4',
      '/videos/idle_neutral_2.mp4',
      '/videos/idle_neutral_3.mp4',
      '/videos/idle_neutral_4.mp4'
    ]
  },
  
  // Activity-specific clips
  activities: {
    feed: {
      success: [
        '/videos/eat_accept_1.mp4',
        '/videos/eat_accept_2.mp4'
      ],
      failure: [
        '/videos/eat_refuse_1.mp4'
      ]
    },
    talk: {
      success: [
        '/videos/talk_attentive_1.mp4',
        '/videos/talk_attentive_2.mp4'
      ],
      failure: [
        '/videos/talk_flat_1.mp4'
      ]
    },
    play: {
      start: [
        '/videos/play_start_1.mp4'
      ],
      success: [
        '/videos/play_success_1.mp4',
        '/videos/play_success_2.mp4'
      ],
      failure: [
        '/videos/play_tired_decline_1.mp4'
      ]
    },
    wash: {
      start: [
        '/videos/wash_start_1.mp4'
      ],
      success: [
        '/videos/wash_refreshed_1.mp4'
      ]
    },
    sleep: {
      settling: [
        '/videos/sleep_settling_1.mp4'
      ],
      sleeping: [
        '/videos/sleep_light_1.mp4',
        '/videos/sleep_light_2.mp4'
      ],
      wake: [
        '/videos/wake_refreshed_1.mp4'
      ]
    },
    tidy: {
      before: [
        '/videos/tidy_before_1.mp4'
      ],
      success: [
        '/videos/tidy_satisfied_1.mp4'
      ],
      failure: [
        '/videos/tidy_tired_1.mp4'
      ]
    },
    comfort: {
      success: [
        '/videos/comfort_receive_1.mp4',
        '/videos/comfort_receive_2.mp4'
      ],
      failure: [
        '/videos/comfort_recoil_1.mp4'
      ]
    },
    confide: {
      success: [
        '/videos/confide_serious_1.mp4',
        '/videos/confide_serious_2.mp4'
      ]
    },
    gift: {
      success: [
        '/videos/gift_accept_1.mp4'
      ],
      failure: [
        '/videos/gift_too_soon_1.mp4'
      ]
    }
  },
  
  // Status-specific clips
  status: {
    sick: [
      '/videos/sick_1.mp4',
      '/videos/sick_2.mp4'
    ],
    leaving: [
      '/videos/leaving_warning_1.mp4'
    ]
  },
  
  // Rare/special clips
  rare: [
    '/videos/rare/spontaneous_laugh.mp4',
    '/videos/rare/thoughtful_moment.mp4',
    '/videos/rare/gentle_smile.mp4',
    '/videos/rare/content_sigh.mp4'
  ],
  
  // Milestone clips
  milestones: [
    '/videos/milestone_reward_1.mp4',
    '/videos/milestone_reward_2.mp4'
  ]
};

export function resolveClip({ mood, statusFlags, activity, outcome, bondLevel }: ClipResolverParams): string {
  // Priority 1: Status flags override everything
  if (statusFlags.includes('sick')) {
    return getRandomClip(CLIP_PATHS.status.sick);
  }
  
  if (statusFlags.includes('leavingWarning')) {
    return getRandomClip(CLIP_PATHS.status.leaving);
  }
  
  // Priority 2: Activity-specific clips
  if (activity && outcome) {
    const activityClips = CLIP_PATHS.activities[activity as keyof typeof CLIP_PATHS.activities];
    if (activityClips && activityClips[outcome as keyof typeof activityClips]) {
      return getRandomClip(activityClips[outcome as keyof typeof activityClips]);
    }
  }
  
  // Priority 3: Mood-based idle clips
  if (statusFlags.includes('playful')) {
    return getRandomClip(CLIP_PATHS.idle.playful);
  }
  
  const moodClips = CLIP_PATHS.idle[mood as keyof typeof CLIP_PATHS.idle];
  if (moodClips) {
    return getRandomClip(moodClips);
  }
  
  // Fallback to neutral
  return getRandomClip(CLIP_PATHS.idle.neutral);
}

function getRandomClip(clips: string[]): string {
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