import { ContentAnalysisResponse, AccountSimulationResponse, GrokAssessment } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeContent(
  content: string,
  hasMedia: boolean = false,
  mediaType: string = 'none',
  videoDurationMs?: number
): Promise<ContentAnalysisResponse> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      has_media: hasMedia,
      media_type: mediaType,
      video_duration_ms: videoDurationMs,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze content');
  }

  return response.json();
}

export async function simulateAccount(
  followersCount: number,
  followingCount: number,
  avgLikes: number,
  avgReplies: number,
  avgRetweets: number,
  postsPerWeek: number,
  accountAgeDays: number,
  isVerified: boolean,
  niche?: string
): Promise<AccountSimulationResponse> {
  const response = await fetch(`${API_URL}/api/account/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      followers_count: followersCount,
      following_count: followingCount,
      avg_likes: avgLikes,
      avg_replies: avgReplies,
      avg_retweets: avgRetweets,
      posts_per_week: postsPerWeek,
      account_age_days: accountAgeDays,
      is_verified: isVerified,
      niche,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to simulate account');
  }

  return response.json();
}

// Grok AI Assessment using Puter.js (client-side)
export async function getGrokAssessment(content: string): Promise<GrokAssessment> {
  // @ts-ignore - puter is loaded via script tag
  if (typeof puter === 'undefined') {
    throw new Error('Puter.js not loaded');
  }

  const prompt = `You are analyzing a social media post for X (Twitter) viral potential. Be witty, direct, and helpful.

Analyze this post:
"${content}"

Respond in this exact JSON format (no markdown, just pure JSON):
{
  "summary": "One sentence witty assessment of viral potential",
  "viral_hooks": ["list", "of", "what makes it shareable"],
  "engagement_drivers": ["what", "will", "get reactions"],
  "risks": ["what", "might", "backfire"],
  "improvements": ["specific", "actionable", "suggestions"],
  "similar_viral_posts": ["describe 1-2 similar posts that went viral"]
}`;

  try {
    // @ts-ignore
    const response = await puter.ai.chat(prompt, { model: 'grok-beta' });
    const text = response.message?.content || response;

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if no JSON found
    return {
      summary: text.slice(0, 200),
      viral_hooks: [],
      engagement_drivers: [],
      risks: [],
      improvements: [],
      similar_viral_posts: [],
    };
  } catch (error) {
    console.error('Grok API error:', error);
    throw error;
  }
}
