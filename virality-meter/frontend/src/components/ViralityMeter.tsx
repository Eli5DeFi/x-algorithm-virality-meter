'use client';

import { motion } from 'framer-motion';
import { getTierColor } from '@/lib/tiers';

interface ViralityMeterProps {
  score: number;
  tierLevel: number;
  tierName: string;
  tierEmoji: string;
  tierDescription: string;
  tierColor: string;
}

export default function ViralityMeter({
  score,
  tierLevel,
  tierName,
  tierEmoji,
  tierDescription,
  tierColor,
}: ViralityMeterProps) {
  const color = getTierColor(tierColor);

  return (
    <div className="space-y-4">
      {/* Terminal header */}
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">virality_score.exe</span>
      </div>

      {/* Main score display */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-3xl font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color }}
            >
              {tierEmoji}
            </motion.span>
            <div>
              <motion.div
                className="text-4xl font-bold font-mono"
                style={{ color }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {score}
                <span className="text-lg text-term-gray">/100</span>
              </motion.div>
              <div className="text-xs text-term-gray">VIRALITY_INDEX</div>
            </div>
          </div>

          <div className="text-right">
            <div
              className="terminal-badge"
              style={{
                background: `${color}15`,
                borderColor: `${color}40`,
                color,
              }}
            >
              TIER_{tierLevel}
            </div>
            <div className="text-sm font-mono mt-1" style={{ color }}>
              {tierName}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="terminal-progress">
            <motion.div
              className="terminal-progress-bar"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Tier markers */}
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tier) => (
              <div
                key={tier}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  tier <= tierLevel ? 'bg-term-green' : 'bg-term-border'
                }`}
                style={tier <= tierLevel ? { backgroundColor: color } : {}}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-term-gray mt-3 font-mono">
          &gt; {tierDescription}
        </p>

        {/* Share button */}
        <motion.button
          onClick={() => {
            const text = `Virality Score: ${score}/100 [${tierName}] - Analyzed by X Algorithm Meter`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="terminal-btn w-full mt-4 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>Share Result</span>
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
