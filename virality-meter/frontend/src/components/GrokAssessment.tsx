'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GrokAssessment as GrokAssessmentType } from '@/lib/types';
import { getGrokAssessment } from '@/lib/api';
import { ALGORITHM_SIGNALS } from '@/lib/tiers';

interface GrokAssessmentProps {
  content: string;
}

export default function GrokAssessment({ content }: GrokAssessmentProps) {
  const [assessment, setAssessment] = useState<GrokAssessmentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showParams, setShowParams] = useState(false);

  const fetchAssessment = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getGrokAssessment(content);
      setAssessment(result);
    } catch (err) {
      setError('Failed to connect to AI service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch assessment when component mounts
  useEffect(() => {
    fetchAssessment();
  }, [content]);

  return (
    <div className="terminal-card">
      {/* Header */}
      <div className="terminal-card-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-gray ml-2">grok_analysis.exe</span>
        <span className="text-[10px] text-term-cyan ml-auto">xAI</span>
      </div>

      <div className="p-3">
        {/* X Parameters Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setShowParams(!showParams)}
            className={`terminal-btn text-xs py-2 px-3 ${showParams ? 'terminal-btn-primary' : ''}`}
          >
            {showParams ? '▼' : '▶'} X_PARAMS
          </button>
        </div>

        {/* Algorithm Parameters Panel */}
        <AnimatePresence>
          {showParams && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-term-bg border border-term-border p-3 space-y-3">
                <div className="text-xs text-term-gray font-mono">
                  <span className="text-term-green">$</span> cat phoenix_scorer.rs
                </div>

                {/* Positive Signals */}
                <div>
                  <div className="text-[10px] text-term-green uppercase mb-1.5">
                    // POSITIVE SIGNALS (boost)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {ALGORITHM_SIGNALS.positive.map((signal) => (
                      <div
                        key={signal.key}
                        className="flex items-center gap-1.5 text-[10px] font-mono"
                      >
                        <span className="text-term-green">+</span>
                        <span className="text-term-gray">{signal.label}</span>
                        <span className={`ml-auto ${
                          signal.weight === 'HIGH' ? 'text-term-green' :
                          signal.weight === 'MEDIUM' ? 'text-term-amber' : 'text-term-gray'
                        }`}>
                          {signal.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negative Signals */}
                <div>
                  <div className="text-[10px] text-term-red uppercase mb-1.5">
                    // NEGATIVE SIGNALS (penalty)
                  </div>
                  <div className="space-y-0.5">
                    {ALGORITHM_SIGNALS.negative.map((signal) => (
                      <div
                        key={signal.key}
                        className="flex items-center gap-1.5 text-[10px] font-mono"
                      >
                        <span className="text-term-red">-</span>
                        <span className="text-term-gray">{signal.label}</span>
                        <span className="text-term-red ml-auto">{signal.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-term-gray pt-2 border-t border-term-border">
                  Source: <a
                    href="https://github.com/AbdelStark/x-algorithm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-term-cyan hover:underline"
                  >
                    github.com/AbdelStark/x-algorithm
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="text-xs text-term-red font-mono mb-3">
            [ERROR] {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-term-cyan font-mono">
            <span className="animate-pulse">●</span>
            Analyzing with AI...
          </div>
        )}

        {/* Assessment Results */}
        {assessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Summary */}
            <div className="bg-term-bg border border-term-green-dim p-2.5">
              <div className="text-[10px] text-term-green mb-1">// SUMMARY</div>
              <p className="text-xs text-gray-300 font-mono">{assessment.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Viral Hooks */}
              {assessment.viral_hooks.length > 0 && (
                <AssessmentList
                  title="VIRAL_HOOKS"
                  items={assessment.viral_hooks}
                  color="green"
                />
              )}

              {/* Engagement Drivers */}
              {assessment.engagement_drivers.length > 0 && (
                <AssessmentList
                  title="DRIVERS"
                  items={assessment.engagement_drivers}
                  color="amber"
                />
              )}

              {/* Risks */}
              {assessment.risks.length > 0 && (
                <AssessmentList
                  title="RISKS"
                  items={assessment.risks}
                  color="red"
                />
              )}

              {/* Improvements */}
              {assessment.improvements.length > 0 && (
                <AssessmentList
                  title="IMPROVE"
                  items={assessment.improvements}
                  color="cyan"
                />
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAssessment}
              disabled={loading}
              className="text-[10px] text-term-gray hover:text-term-green font-mono transition-colors"
            >
              &gt; refresh_analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AssessmentList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'text-term-green border-term-green-dim',
    amber: 'text-term-amber border-term-amber',
    red: 'text-term-red border-term-red',
    cyan: 'text-term-cyan border-term-cyan',
  };

  return (
    <div className={`bg-term-bg border p-2 ${colorMap[color]?.split(' ')[1] || 'border-term-border'}`}>
      <div className={`text-[10px] ${colorMap[color]?.split(' ')[0]} mb-1`}>
        // {title}
      </div>
      <ul className="space-y-0.5">
        {items.slice(0, 3).map((item, i) => (
          <li key={i} className="text-[10px] text-gray-400 font-mono truncate">
            - {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
