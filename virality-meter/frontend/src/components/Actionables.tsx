'use client';

import { motion } from 'framer-motion';
import { ContentAnalysisResponse, AccountSimulationResponse } from '@/lib/types';

interface ActionablesProps {
  postScore: ContentAnalysisResponse;
  accountScore: AccountSimulationResponse;
  aggregateScore: number;
}

interface Action {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'content' | 'account' | 'engagement' | 'timing';
  impact: string;
}

export default function Actionables({ postScore, accountScore, aggregateScore }: ActionablesProps) {
  const actions: Action[] = [];

  // Analyze content and generate specific actions
  const stats = postScore.content_stats;

  // Content quality actions
  if (stats.char_count < 50) {
    actions.push({
      title: 'Expand Your Content',
      description: 'Your post is very short. Add more context or details. Optimal range is 50-280 characters for better engagement.',
      priority: 'high',
      category: 'content',
      impact: '+15-25% reach'
    });
  }

  if (stats.char_count > 280 && stats.viral_hooks === 0) {
    actions.push({
      title: 'Add Thread Indicator',
      description: 'Long content works better as threads. Start with "🧵 Thread:" or number your points (1/, 2/, etc.).',
      priority: 'medium',
      category: 'content',
      impact: '+20-30% engagement'
    });
  }

  if (!stats.has_question && !stats.has_cta) {
    actions.push({
      title: 'Add Engagement Trigger',
      description: 'Include a question ("What do you think?") or CTA ("Share if you agree") to drive replies and interactions.',
      priority: 'high',
      category: 'engagement',
      impact: '+25-40% replies'
    });
  }

  if (stats.hashtag_count === 0) {
    actions.push({
      title: 'Use 1-2 Relevant Hashtags',
      description: 'Add hashtags related to trending topics in your niche. Optimal: 1-3 hashtags. Avoid more than 5.',
      priority: 'medium',
      category: 'content',
      impact: '+10-15% discoverability'
    });
  } else if (stats.hashtag_count > 5) {
    actions.push({
      title: 'Reduce Hashtag Count',
      description: `You have ${stats.hashtag_count} hashtags. This looks spammy. Keep it to 1-3 for best results.`,
      priority: 'critical',
      category: 'content',
      impact: 'Avoid -30% penalty'
    });
  }

  if (stats.diversity_score < 0.5) {
    actions.push({
      title: 'Increase Content Variety',
      description: 'Your content lacks diversity. Mix text with media, add emojis, include links, or mention relevant accounts.',
      priority: 'high',
      category: 'content',
      impact: '+20-35% distribution'
    });
  }

  if (stats.viral_hooks === 0 && stats.char_count > 100) {
    actions.push({
      title: 'Add Viral Hooks',
      description: 'Use proven patterns: "Thread:", "POV:", "Nobody talks about...", "Hot take:", or "Here\'s why..."',
      priority: 'medium',
      category: 'content',
      impact: '+15-25% shareability'
    });
  }

  // Account quality actions
  const engagementRate = accountScore.engagement_rate;

  if (engagementRate < 1) {
    actions.push({
      title: 'Improve Engagement Rate',
      description: 'Your engagement is very low (<1%). Focus on creating conversation-starting content and engage with replies.',
      priority: 'critical',
      category: 'account',
      impact: '+40-60% reach'
    });
  } else if (engagementRate < 2) {
    actions.push({
      title: 'Boost Engagement Rate',
      description: 'Aim for 2-5% engagement rate. Reply to comments, ask questions, and post at peak times for your audience.',
      priority: 'high',
      category: 'engagement',
      impact: '+25-40% visibility'
    });
  }

  if (accountScore.follower_quality_score < 0.5) {
    actions.push({
      title: 'Improve Follower Quality',
      description: `Your follower/following ratio is low. Avoid follow-for-follow. Engage authentically with your niche community.`,
      priority: 'high',
      category: 'account',
      impact: '+20-35% algorithmic trust'
    });
  }

  const postsPerDay = accountScore.consistency_score < 0.5 ? 'low' :
                      accountScore.consistency_score < 0.8 ? 'inconsistent' : 'good';

  if (accountScore.consistency_score < 0.7) {
    actions.push({
      title: 'Post More Consistently',
      description: 'Aim for 1-5 tweets per day. Consistency signals to the algorithm that you\'re an active, valuable account.',
      priority: 'high',
      category: 'timing',
      impact: '+15-30% base reach'
    });
  }

  if (!accountScore.recommendations.find(r => r.signal === 'verification') && aggregateScore < 70) {
    actions.push({
      title: 'Consider X Premium',
      description: 'Verified accounts get +15 score boost and priority ranking. Worth it if you\'re serious about growth.',
      priority: 'medium',
      category: 'account',
      impact: '+20-40% reach boost'
    });
  }

  // Timing actions
  if (aggregateScore >= 60) {
    actions.push({
      title: 'Post During Peak Hours',
      description: 'Your content is good! Maximize reach by posting when your audience is most active (usually 9-11 AM, 6-8 PM local time).',
      priority: 'medium',
      category: 'timing',
      impact: '+30-50% immediate engagement'
    });
  }

  // Content type specific actions
  if (postScore.controversy_risk > 0.7) {
    actions.push({
      title: 'Balance Controversy',
      description: 'High controversy can drive engagement but also blocks/mutes. Follow up with value-add content to maintain trust.',
      priority: 'medium',
      category: 'engagement',
      impact: 'Protect long-term reach'
    });
  }

  // Sort actions by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedActions = actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="terminal-card">
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">actionables.todo</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-mono text-term-green font-bold">
            Action Items ({sortedActions.length})
          </h3>
          <span className="text-xs text-term-gray font-mono">
            Based on X Algorithm Analysis
          </span>
        </div>

        {sortedActions.length === 0 ? (
          <div className="text-center py-6 text-gray-400 font-mono text-xs">
            <div className="text-term-green text-2xl mb-2">✓</div>
            <div>Excellent! No critical actions needed.</div>
            <div className="text-gray-500 mt-1">Your content follows algorithm best practices.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedActions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border-l-2 pl-3 py-2 ${
                  action.priority === 'critical' ? 'border-term-red bg-term-red/5' :
                  action.priority === 'high' ? 'border-term-amber bg-term-amber/5' :
                  action.priority === 'medium' ? 'border-term-cyan bg-term-cyan/5' :
                  'border-term-gray bg-term-bg-light'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 font-mono uppercase font-bold ${
                        action.priority === 'critical' ? 'bg-term-red text-white' :
                        action.priority === 'high' ? 'bg-term-amber text-term-bg' :
                        action.priority === 'medium' ? 'bg-term-cyan text-term-bg' :
                        'bg-term-gray text-white'
                      }`}>
                        {action.priority}
                      </span>
                      <span className="text-[10px] text-term-gray font-mono uppercase">
                        {action.category}
                      </span>
                    </div>
                    <div className="text-sm font-mono font-bold text-gray-200 mb-1">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-400 font-mono leading-relaxed">
                      {action.description}
                    </div>
                  </div>
                  <div className="text-[10px] text-term-green font-mono whitespace-nowrap">
                    {action.impact}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="border-t border-term-border pt-3 mt-4">
          <div className="text-[10px] text-gray-500 font-mono">
            <span className="text-term-cyan">TIP:</span> Tackle CRITICAL and HIGH priority items first for maximum impact on your next post.
          </div>
        </div>
      </div>
    </div>
  );
}
