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

const signalLabels: Record<string, { label: string; icon: string }> = {
  favorite: { label: 'likes', icon: '♥' },
  reply: { label: 'replies', icon: '→' },
  retweet: { label: 'retweets', icon: '⟳' },
  quote: { label: 'quotes', icon: '❝' },
  follow_author: { label: 'follows', icon: '+' },
  click: { label: 'clicks', icon: '◎' },
  profile_click: { label: 'profile', icon: '◉' },
  photo_expand: { label: 'images', icon: '▣' },
  video_quality_view: { label: 'video', icon: '▶' },
  dwell_time: { label: 'dwell', icon: '◷' },
  share: { label: 'shares', icon: '↗' },
  share_dm: { label: 'dm_share', icon: '✉' },
  share_copy_link: { label: 'link', icon: '⊡' },
  not_interested: { label: 'hide_risk', icon: '×' },
  block_author: { label: 'block_risk', icon: '⊘' },
  mute_author: { label: 'mute_risk', icon: '◌' },
  report: { label: 'report_risk', icon: '!' },
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

  return (
    <div className="space-y-3">
      {/* Terminal header */}
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">score_breakdown.exe</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 p-3 bg-term-bg">
        <StatCell label="engage" value={engagementPotential} color="green" />
        <StatCell label="share" value={shareability} color="cyan" />
        <StatCell label="controv" value={controversyRisk} color="amber" />
        <StatCell label="risk" value={negativeRisk} color="red" inverse />
      </div>

      {/* Positive Signals */}
      <div className="p-3 bg-term-bg border border-term-border">
        <div className="text-xs text-term-gray font-mono mb-2">
          <span className="text-term-green">$</span> engagement_signals
        </div>
        <div className="space-y-1.5">
          {positiveSignals.slice(0, 6).map((signal, index) => (
            <SignalBar key={signal.signal} signal={signal} index={index} />
          ))}
        </div>
      </div>

      {/* Negative Signals */}
      {negativeSignals.length > 0 && (
        <div className="p-3 bg-term-bg border border-term-border">
          <div className="text-xs text-term-gray font-mono mb-2">
            <span className="text-term-red">!</span> risk_signals
          </div>
          <div className="space-y-1.5">
            {negativeSignals.map((signal, index) => (
              <SignalBar key={signal.signal} signal={signal} index={index} isNegative />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({
  label,
  value,
  color,
  inverse = false,
}: {
  label: string;
  value: number;
  color: string;
  inverse?: boolean;
}) {
  const percentage = Math.round(value * 100);
  const displayValue = inverse ? 100 - percentage : percentage;

  const colorMap: Record<string, string> = {
    green: 'text-term-green',
    cyan: 'text-term-cyan',
    amber: 'text-term-amber',
    red: 'text-term-red',
  };

  return (
    <div className="text-center">
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
  const info = signalLabels[signal.signal] || { label: signal.signal, icon: '◆' };
  const percentage = Math.round(signal.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-2 text-xs font-mono"
    >
      <span className={isNegative ? 'text-term-red' : 'text-term-green'}>
        {info.icon}
      </span>
      <span className="text-term-gray w-16 truncate">{info.label}</span>
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
