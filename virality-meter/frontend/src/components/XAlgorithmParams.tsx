'use client';

import { motion } from 'framer-motion';
import { ALGORITHM_SIGNALS } from '@/lib/tiers';

export default function XAlgorithmParams() {
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
        <span className="text-xs text-term-gray ml-2">x_algorithm_params.rs</span>
        <a
          href="https://github.com/AbdelStark/x-algorithm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-term-cyan ml-auto hover:underline"
        >
          source
        </a>
      </div>

      <div className="p-3 space-y-3">
        <div className="text-xs text-term-gray font-mono">
          <span className="text-term-green">$</span> cat phoenix_scorer.rs | grep -E "signal|weight"
        </div>

        {/* Positive Signals */}
        <div>
          <div className="text-[10px] text-term-green uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-term-green rounded-full" />
            POSITIVE SIGNALS (engagement boost)
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {ALGORITHM_SIGNALS.positive.map((signal) => (
              <div
                key={signal.key}
                className="flex items-center gap-1.5 text-[10px] font-mono group"
                title={signal.description}
              >
                <span className="text-term-green">+</span>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
                  {signal.label}
                </span>
                <span
                  className={`ml-auto px-1 rounded ${
                    signal.weight === 'HIGH'
                      ? 'bg-term-green/20 text-term-green'
                      : signal.weight === 'MEDIUM'
                      ? 'bg-term-amber/20 text-term-amber'
                      : 'bg-term-gray/20 text-term-gray'
                  }`}
                >
                  {signal.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Signals */}
        <div>
          <div className="text-[10px] text-term-red uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-term-red rounded-full" />
            NEGATIVE SIGNALS (ranking penalty)
          </div>
          <div className="space-y-1">
            {ALGORITHM_SIGNALS.negative.map((signal) => (
              <div
                key={signal.key}
                className="flex items-center gap-1.5 text-[10px] font-mono group"
                title={signal.description}
              >
                <span className="text-term-red">-</span>
                <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
                  {signal.label}
                </span>
                <span className="ml-auto px-1 rounded bg-term-red/20 text-term-red">
                  {signal.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="pt-2 border-t border-term-border">
          <div className="text-[10px] text-term-cyan uppercase mb-2">
            // KEY ALGORITHM INSIGHTS
          </div>
          <ul className="space-y-1 text-[10px] text-gray-400 font-mono">
            <li>• Replies have highest weight - conversation drives reach</li>
            <li>• Media content gets 2x engagement multiplier</li>
            <li>• Blocks/reports heavily penalize future distribution</li>
            <li>• Video watch time (50%+) counts as quality view</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
