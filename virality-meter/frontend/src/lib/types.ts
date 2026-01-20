// API Response Types

export interface SignalScore {
  signal: string;
  score: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface ImprovementTip {
  signal: string;
  tip: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  emoji: string;
}

export interface ContentAnalysisResponse {
  score: number;
  tier_level: number;
  tier_name: string;
  tier_emoji: string;
  tier_description: string;
  tier_color: string;
  signal_scores: SignalScore[];
  engagement_potential: number;
  shareability: number;
  controversy_risk: number;
  negative_signal_risk: number;
  improvements: ImprovementTip[];
  content_stats: {
    char_count: number;
    word_count: number;
    hashtag_count: number;
    mention_count: number;
    has_question: boolean;
    has_cta: boolean;
    emotional_tone: string;
    viral_hooks: number;
  };
}

export interface AccountSimulationResponse {
  account_tier: number;
  account_tier_name: string;
  account_tier_emoji: string;
  overall_score: number;
  engagement_rate: number;
  follower_quality_score: number;
  consistency_score: number;
  growth_potential: number;
  recommendations: ImprovementTip[];
  projected_reach_multiplier: number;
  viral_post_probability: number;
}

export interface ViralityTier {
  level: number;
  name: string;
  emoji: string;
  description: string;
  min_score: number;
  max_score: number;
  color: string;
}

export interface GrokAssessment {
  summary: string;
  viral_hooks: string[];
  engagement_drivers: string[];
  risks: string[];
  improvements: string[];
  similar_viral_posts: string[];
}
