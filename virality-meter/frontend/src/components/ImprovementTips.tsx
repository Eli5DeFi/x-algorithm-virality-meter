'use client';

import { motion } from 'framer-motion';
import { ImprovementTip } from '@/lib/types';

interface ImprovementTipsProps {
  tips: ImprovementTip[];
}

export default function ImprovementTips({ tips }: ImprovementTipsProps) {
  if (tips.length === 0) {
    return (
      <div className="terminal-card">
        <div className="terminal-card-header">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
          <span className="text-xs text-term-gray ml-2">improvements.log</span>
        </div>
        <div className="p-4 text-center">
          <span className="text-term-green text-2xl">✓</span>
          <p className="text-term-green font-mono text-sm mt-2">
            OPTIMIZED - No improvements needed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-card">
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">improvements.log</span>
      </div>

      <div className="p-3 space-y-2">
        <div className="text-xs text-term-gray font-mono mb-2">
          <span className="text-term-amber">&gt;</span> {tips.length} suggestions found
        </div>

        {tips.map((tip, index) => (
          <TipItem key={index} tip={tip} index={index} />
        ))}
      </div>
    </div>
  );
}

function TipItem({ tip, index }: { tip: ImprovementTip; index: number }) {
  const priorityConfig: Record<string, { color: string; label: string; bg: string }> = {
    high: { color: 'text-term-red', label: 'HIGH', bg: 'bg-term-red/10' },
    medium: { color: 'text-term-amber', label: 'MED', bg: 'bg-term-amber/10' },
    low: { color: 'text-term-cyan', label: 'LOW', bg: 'bg-term-cyan/10' },
  };

  const config = priorityConfig[tip.priority] || priorityConfig.medium;

  return (
    <motion.div
      className={`${config.bg} border border-term-border p-2.5 text-xs font-mono`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start gap-2">
        <span className={`${config.color} shrink-0`}>[{config.label}]</span>
        <div className="flex-1 space-y-1.5">
          {/* Main tip */}
          <p className="text-gray-200 font-medium">{tip.emoji} {tip.tip}</p>

          {/* Action - specific instruction */}
          {tip.action && (
            <p className="text-term-cyan text-[10px]">
              <span className="text-term-gray">ACTION:</span> {tip.action}
            </p>
          )}

          {/* Example - concrete example */}
          {tip.example && (
            <p className="text-term-gray text-[10px] italic">
              {tip.example}
            </p>
          )}

          {/* Impact */}
          <div className="flex items-center gap-2 pt-1 border-t border-term-border/50">
            <span className="text-term-green font-bold">{tip.impact}</span>
            <span className="text-term-gray">expected impact</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
