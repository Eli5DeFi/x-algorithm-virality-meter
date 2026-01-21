'use client';

import { motion } from 'framer-motion';
import { SignalScore } from '@/lib/types';

interface ScoreBreakdownProps {
  signalScores: SignalScore[];
  engagementPotential: number;
  shareability: number;
  controversyRisk: number;
  negativeRisk: number;
}

const signalLabels: Record<string, { label: string; icon: string; description: string }> = {
  favorite: { label: 'likes', icon: '♥', description: 'Probability of receiving likes based on content quality and emotional resonance' },
  reply: { label: 'replies', icon: '→', description: 'Likelihood of sparking conversation through questions or controversial takes' },
  retweet: { label: 'retweets', icon: '⟳', description: 'Shareability score - viral hooks and trending alignment increase this' },
  quote: { label: 'quotes', icon: '❝', description: 'Quote tweet potential - controversial or thought-provoking content scores higher' },
  follow_author: { label: 'follows', icon: '+', description: 'New follower probability - high quality viral content attracts followers' },
  click: { label: 'clicks', icon: '◎', description: 'Tweet click rate - threads and longer content drive more clicks' },
  profile_click: { label: 'profile', icon: '◉', description: 'Profile visit likelihood - interesting content makes people check your profile' },
  photo_expand: { label: 'images', icon: '▣', description: 'Image engagement - visual content dramatically increases this' },
  video_quality_view: { label: 'video', icon: '▶', description: 'Video completion rate - 30s-2min videos have highest completion' },
  dwell_time: { label: 'dwell', icon: '◷', description: 'Read time prediction - longer, well-structured content keeps attention' },
  share: { label: 'shares', icon: '↗', description: 'General share probability - valuable content gets shared more' },
  share_dm: { label: 'dm_share', icon: '✉', description: 'DM share likelihood - personal/relatable content gets sent privately' },
  share_copy_link: { label: 'link', icon: '⊡', description: 'Link copy rate - reference-worthy content gets saved' },
  not_interested: { label: 'hide_risk', icon: '×', description: 'Risk of "Not Interested" - spammy signals trigger this' },
  block_author: { label: 'block_risk', icon: '⊘', description: 'Block risk - aggressive/offensive content leads to blocks' },
  mute_author: { label: 'mute_risk', icon: '◌', description: 'Mute risk - annoying patterns lead to mutes' },
  report: { label: 'report_risk', icon: '!', description: 'Report risk - policy violations get reported' },
  deboost: { label: 'deboost', icon: '↓', description: 'Shadowban risk - spammy keywords or engagement-farming patterns' },
};

// Insights based on score values
const getInsight = (engagementPotential: number, shareability: number, controversyRisk: number, negativeRisk: number): string => {
  const engagement = Math.round(engagementPotential * 100);
  const share = Math.round(shareability * 100);
  const controversy = Math.round(controversyRisk * 100);
  const risk = Math.round(negativeRisk * 100);

  if (risk > 30) {
    return "High negative signal risk detected. Consider reducing caps, hashtag spam, or aggressive language.";
  }
  if (engagement < 40 && share < 40) {
    return "Content lacks engagement drivers. Add a question, media, or viral hook to improve reach.";
  }
  if (controversy > 60 && engagement > 50) {
    return "Spicy take detected! High quote/reply potential but monitor for backlash.";
  }
  if (share > 70) {
    return "Highly shareable content! Strong viral hooks and trending alignment detected.";
  }
  if (engagement > 70) {
    return "Excellent engagement potential. Content has strong emotional resonance.";
  }
  if (engagement > 50 && share > 50) {
    return "Well-balanced content with solid engagement and share potential.";
  }
  return "Moderate viral potential. Consider adding visual media or a stronger hook.";
};

export default function ScoreBreakdown({
  signalScores,
  engagementPotential,
  shareability,
  controversyRisk,
  negativeRisk,
}: ScoreBreakdownProps) {
  const positiveSignals = signalScores.filter((s) => s.impact === 'positive');
  const negativeSignals = signalScores.filter((s) => s.impact === 'negative');
  const insight = getInsight(engagementPotential, shareability, controversyRisk, negativeRisk);

  return (
    <div className="terminal-card">
      {/* Terminal header */}
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">score_breakdown.exe</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Summary Stats with explanations */}
        <div>
          <div className="text-xs text-term-gray font-mono mb-2">
            <span className="text-term-green">$</span> aggregate_metrics
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatCell
              label="engage"
              value={engagementPotential}
              color="green"
              tooltip="Overall engagement probability combining likes, replies, and other interactions"
            />
            <StatCell
              label="share"
              value={shareability}
              color="cyan"
              tooltip="Likelihood of being retweeted, quoted, or shared externally"
            />
            <StatCell
              label="controv"
              value={controversyRisk}
              color="amber"
              tooltip="Controversy level - high values drive quotes/replies but may attract backlash"
            />
            <StatCell
              label="risk"
              value={negativeRisk}
              color="red"
              inverse
              tooltip="Negative signal risk (lower is better) - blocks, mutes, reports probability"
            />
          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-term-bg border border-term-cyan/30 p-2.5 rounded"
        >
          <div className="flex items-start gap-2">
            <span className="text-term-cyan text-xs">{'>'}</span>
            <p className="text-[11px] text-term-cyan font-mono leading-relaxed">
              {insight}
            </p>
          </div>
        </motion.div>

        {/* Positive Signals */}
        <div className="bg-term-bg border border-term-border p-2.5 rounded">
          <div className="text-xs text-term-gray font-mono mb-2">
            <span className="text-term-green">$</span> engagement_signals --verbose
          </div>
          <div className="space-y-1.5">
            {positiveSignals.slice(0, 6).map((signal, index) => (
              <SignalBar key={signal.signal} signal={signal} index={index} />
            ))}
          </div>
        </div>

        {/* Negative Signals */}
        {negativeSignals.length > 0 && negativeRisk > 0.05 && (
          <div className="bg-term-bg border border-term-red/30 p-2.5 rounded">
            <div className="text-xs text-term-gray font-mono mb-2">
              <span className="text-term-red">!</span> risk_signals --warning
            </div>
            <div className="space-y-1.5">
              {negativeSignals.filter(s => s.score > 0.05).map((signal, index) => (
                <SignalBar key={signal.signal} signal={signal} index={index} isNegative />
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="pt-2 border-t border-term-border">
          <div className="text-[10px] text-term-gray font-mono">
            <span className="text-term-cyan">TIP:</span> Hover over signal bars to see detailed explanations of each metric.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  color,
  inverse = false,
  tooltip,
}: {
  label: string;
  value: number;
  color: string;
  inverse?: boolean;
  tooltip?: string;
}) {
  const percentage = Math.round(value * 100);
  const displayValue = inverse ? 100 - percentage : percentage;

  const colorMap: Record<string, string> = {
    green: 'text-term-green',
    cyan: 'text-term-cyan',
    amber: 'text-term-amber',
    red: 'text-term-red',
  };

  const bgMap: Record<string, string> = {
    green: 'bg-term-green/10',
    cyan: 'bg-term-cyan/10',
    amber: 'bg-term-amber/10',
    red: 'bg-term-red/10',
  };

  return (
    <div
      className={`text-center p-2 rounded ${bgMap[color]} cursor-help transition-all hover:scale-105`}
      title={tooltip}
    >
      <div className={`text-lg font-mono font-bold ${colorMap[color]}`}>
        {displayValue}%
      </div>
      <div className="text-[10px] text-term-gray uppercase font-mono">{label}</div>
    </div>
  );
}

function SignalBar({
  signal,
  index,
  isNegative = false,
}: {
  signal: SignalScore;
  index: number;
  isNegative?: boolean;
}) {
  const info = signalLabels[signal.signal] || { label: signal.signal, icon: '◆', description: signal.explanation };
  const percentage = Math.round(signal.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group flex items-center gap-2 text-xs font-mono cursor-help"
      title={info.description}
    >
      <span className={isNegative ? 'text-term-red' : 'text-term-green'}>
        {info.icon}
      </span>
      <span className="text-term-gray w-16 truncate group-hover:text-white transition-colors">
        {info.label}
      </span>
      <div className="flex-1 h-1.5 bg-term-border rounded-sm overflow-hidden">
        <motion.div
          className={`h-full ${isNegative ? 'bg-term-red' : 'bg-term-green'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
        />
      </div>
      <span className={`w-8 text-right ${isNegative ? 'text-term-red' : 'text-term-green'}`}>
        {percentage}%
      </span>
    </motion.div>
  );
}
