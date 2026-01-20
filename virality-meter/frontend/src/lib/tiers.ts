import { ViralityTier } from './types';

// Terminal-style tier system
export const VIRALITY_TIERS: ViralityTier[] = [
  {
    level: 1,
    name: "DEAD_SIGNAL",
    emoji: "×",
    description: "No engagement detected. Content buried.",
    min_score: 0,
    max_score: 10,
    color: "gray"
  },
  {
    level: 2,
    name: "LOW_REACH",
    emoji: "○",
    description: "Minimal algorithmic distribution.",
    min_score: 11,
    max_score: 20,
    color: "gray"
  },
  {
    level: 3,
    name: "WARMING_UP",
    emoji: "◐",
    description: "Beginning to gain traction.",
    min_score: 21,
    max_score: 30,
    color: "dim"
  },
  {
    level: 4,
    name: "BASELINE",
    emoji: "◑",
    description: "Average engagement levels.",
    min_score: 31,
    max_score: 40,
    color: "green-dim"
  },
  {
    level: 5,
    name: "GAINING",
    emoji: "●",
    description: "Above average distribution.",
    min_score: 41,
    max_score: 50,
    color: "green"
  },
  {
    level: 6,
    name: "TRENDING",
    emoji: "◉",
    description: "Algorithm is boosting reach.",
    min_score: 51,
    max_score: 60,
    color: "green-bright"
  },
  {
    level: 7,
    name: "HOT",
    emoji: "▲",
    description: "High engagement multiplier active.",
    min_score: 61,
    max_score: 70,
    color: "amber"
  },
  {
    level: 8,
    name: "VIRAL",
    emoji: "△",
    description: "Exponential reach detected.",
    min_score: 71,
    max_score: 80,
    color: "amber-bright"
  },
  {
    level: 9,
    name: "PEAK",
    emoji: "★",
    description: "Maximum algorithmic boost.",
    min_score: 81,
    max_score: 90,
    color: "cyan"
  },
  {
    level: 10,
    name: "LEGENDARY",
    emoji: "✦",
    description: "Top 0.1% viral potential.",
    min_score: 91,
    max_score: 100,
    color: "cyan-bright"
  },
];

export function getTierForScore(score: number): ViralityTier {
  const clampedScore = Math.max(0, Math.min(100, score));
  return VIRALITY_TIERS.find(
    tier => clampedScore >= tier.min_score && clampedScore <= tier.max_score
  ) || VIRALITY_TIERS[0];
}

export function getTierColor(color: string): string {
  const colors: Record<string, string> = {
    'gray': '#555555',
    'dim': '#777777',
    'green-dim': '#00aa2a',
    'green': '#00cc33',
    'green-bright': '#00ff41',
    'amber': '#ffb000',
    'amber-bright': '#ffcc00',
    'cyan': '#00d4ff',
    'cyan-bright': '#00ffff',
  };
  return colors[color] || colors.gray;
}

// X Algorithm engagement signals (from phoenix_scorer.rs)
export const ALGORITHM_SIGNALS = {
  positive: [
    { key: 'favorite', label: 'Like', weight: 'HIGH', description: 'User likes the tweet' },
    { key: 'reply', label: 'Reply', weight: 'HIGH', description: 'User replies to the tweet' },
    { key: 'retweet', label: 'Repost', weight: 'HIGH', description: 'User reposts the tweet' },
    { key: 'quote', label: 'Quote', weight: 'MEDIUM', description: 'User quotes the tweet' },
    { key: 'follow_author', label: 'Follow', weight: 'HIGH', description: 'User follows after seeing tweet' },
    { key: 'click', label: 'Click', weight: 'MEDIUM', description: 'User clicks on tweet' },
    { key: 'profile_click', label: 'Profile Visit', weight: 'MEDIUM', description: 'User visits author profile' },
    { key: 'video_view', label: 'Video View', weight: 'MEDIUM', description: 'Quality video view (50%+ watched)' },
    { key: 'photo_expand', label: 'Image Expand', weight: 'LOW', description: 'User expands image' },
    { key: 'dwell_time', label: 'Dwell Time', weight: 'MEDIUM', description: 'Time spent reading' },
    { key: 'share', label: 'Share', weight: 'MEDIUM', description: 'User shares externally' },
  ],
  negative: [
    { key: 'not_interested', label: 'Not Interested', weight: 'NEGATIVE', description: 'User marks as not interested' },
    { key: 'block_author', label: 'Block', weight: 'VERY_NEGATIVE', description: 'User blocks author' },
    { key: 'mute_author', label: 'Mute', weight: 'NEGATIVE', description: 'User mutes author' },
    { key: 'report', label: 'Report', weight: 'VERY_NEGATIVE', description: 'User reports tweet' },
  ],
};
