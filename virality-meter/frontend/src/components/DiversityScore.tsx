'use client';

import { motion } from 'framer-motion';
import { DiversityScore as DiversityScoreType } from '@/lib/types';

interface DiversityScoreProps {
  diversity: DiversityScoreType;
}

const TIER_COLORS: Record<string, string> = {
  HIGHLY_DIVERSE: 'text-term-green',
  WELL_BALANCED: 'text-term-cyan',
  MODERATE: 'text-term-amber',
  LIMITED: 'text-term-red',
  MONOTONE: 'text-term-red',
};

const TIER_BG: Record<string, string> = {
  HIGHLY_DIVERSE: 'bg-term-green/20',
  WELL_BALANCED: 'bg-term-cyan/20',
  MODERATE: 'bg-term-amber/20',
  LIMITED: 'bg-term-red/20',
  MONOTONE: 'bg-term-red/20',
};

export default function DiversityScore({ diversity }: DiversityScoreProps) {
  const tierColor = TIER_COLORS[diversity.diversity_tier] || 'text-term-gray';
  const tierBg = TIER_BG[diversity.diversity_tier] || 'bg-term-gray/20';

  // Get key factors to display
  const factors = diversity.factors || {};
  const factorKeys = ['format_diversity', 'engagement_diversity', 'topic_richness', 'uniqueness'];

  return (
    <motion.div
      className="terminal-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">diversity_scorer.rs</span>
      </div>

      <div className="p-3 space-y-3">
        {/* Header with score */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-term-gray font-mono">
            <span className="text-term-green">$</span> analyze --diversity
          </div>
          <div className={`${tierBg} px-2 py-0.5 rounded text-xs font-mono ${tierColor}`}>
            {diversity.diversity_score}/100
          </div>
        </div>

        {/* Tier display */}
        <div className={`${tierBg} border border-term-border p-2 rounded`}>
          <div className={`text-sm font-mono font-bold ${tierColor}`}>
            {diversity.diversity_tier.replace('_', ' ')}
          </div>
          <div className="text-[10px] text-term-gray mt-1">
            {diversity.tier_description}
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="space-y-2">
          <div className="text-[10px] text-term-cyan uppercase">
            // DIVERSITY FACTORS
          </div>

          {factorKeys.map((key) => {
            const factor = factors[key];
            if (!factor) return null;

            const score = factor.score || 0;
            const percentage = Math.round(score * 100);

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-gray-400">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className={`${percentage >= 60 ? 'text-term-green' : percentage >= 40 ? 'text-term-amber' : 'text-term-red'}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="h-1 bg-term-border rounded overflow-hidden">
                  <motion.div
                    className={`h-full ${percentage >= 60 ? 'bg-term-green' : percentage >= 40 ? 'bg-term-amber' : 'bg-term-red'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight */}
        <div className="pt-2 border-t border-term-border text-[10px] text-term-gray font-mono">
          <span className="text-term-cyan">TIP:</span> High diversity scores signal to the algorithm
          that your content is unique and engaging across multiple dimensions.
        </div>
      </div>
    </motion.div>
  );
}
