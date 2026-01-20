'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentInput from '@/components/ContentInput';
import ViralityMeter from '@/components/ViralityMeter';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import ImprovementTips from '@/components/ImprovementTips';
import GrokAssessment from '@/components/GrokAssessment';
import { ContentAnalysisResponse } from '@/lib/types';
import { analyzeContent } from '@/lib/api';
import { VIRALITY_TIERS } from '@/lib/tiers';

export default function Home() {
  const [result, setResult] = useState<ContentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedContent, setAnalyzedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'breakdown' | 'tips' | 'grok'>('breakdown');

  const handleAnalyze = async (
    content: string,
    hasMedia: boolean,
    mediaType: string,
    videoDuration?: number
  ) => {
    setLoading(true);
    setError(null);
    setAnalyzedContent(content);

    try {
      const response = await analyzeContent(content, hasMedia, mediaType, videoDuration);
      setResult(response);
    } catch (err) {
      setError('Connection failed. Ensure backend is running on localhost:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-term-bg scanlines">
      {/* Header */}
      <header className="border-b border-term-border sticky top-0 bg-term-bg/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-term-green rounded flex items-center justify-center">
              <span className="text-term-green font-mono text-sm">X</span>
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-term-green">
                VIRALITY_METER
              </h1>
              <p className="text-[10px] text-term-gray font-mono">
                X Algorithm Analysis Tool
              </p>
            </div>
          </div>
          <a
            href="/account"
            className="terminal-btn text-xs py-1.5 px-3"
          >
            ACCOUNT_SIM
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tier Legend */}
        <div className="mb-6 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-1.5 min-w-max">
            {VIRALITY_TIERS.map((tier, index) => (
              <motion.div
                key={tier.level}
                className="flex items-center gap-1 px-2 py-1 bg-term-bg-light border border-term-border rounded text-[10px] font-mono hover:border-term-green-dim transition-colors cursor-default"
                title={tier.description}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <span className="text-term-gray">{tier.level}.</span>
                <span className="text-term-green">{tier.emoji}</span>
                <span className="hidden sm:inline text-term-gray">{tier.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column - Input */}
          <div className="space-y-4">
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="terminal-card-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-term-gray ml-2">content_input.sh</span>
              </div>
              <div className="p-4">
                <ContentInput onAnalyze={handleAnalyze} loading={loading} />
              </div>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-term-bg border border-term-red p-3 text-term-red text-xs font-mono"
              >
                [ERROR] {error}
              </motion.div>
            )}

            {/* Mobile Tabs */}
            {result && (
              <div className="lg:hidden">
                <div className="flex gap-1.5 mb-3">
                  {[
                    { id: 'breakdown', label: 'BREAKDOWN' },
                    { id: 'tips', label: 'TIPS' },
                    { id: 'grok', label: 'GROK' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 py-1.5 text-[10px] font-mono transition-all ${
                        activeTab === tab.id
                          ? 'bg-term-green text-term-bg'
                          : 'bg-term-bg-light text-term-gray border border-term-border hover:border-term-green-dim'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'breakdown' && (
                    <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ScoreBreakdown
                        signalScores={result.signal_scores}
                        engagementPotential={result.engagement_potential}
                        shareability={result.shareability}
                        controversyRisk={result.controversy_risk}
                        negativeRisk={result.negative_signal_risk}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'tips' && (
                    <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ImprovementTips tips={result.improvements} />
                    </motion.div>
                  )}
                  {activeTab === 'grok' && (
                    <motion.div key="grok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <GrokAssessment content={analyzedContent} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {/* Virality Meter */}
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {result ? (
                <ViralityMeter
                  score={result.score}
                  tierLevel={result.tier_level}
                  tierName={result.tier_name}
                  tierEmoji={result.tier_emoji}
                  tierDescription={result.tier_description}
                  tierColor={result.tier_color}
                />
              ) : (
                <>
                  <div className="terminal-card-header">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-xs text-term-gray ml-2">virality_score.exe</span>
                  </div>
                  <div className="p-8 text-center">
                    <div className="text-term-gray font-mono text-sm">
                      <span className="text-term-green animate-blink">_</span> Awaiting input...
                    </div>
                    <p className="text-term-gray text-xs font-mono mt-2">
                      Enter content to analyze virality
                    </p>
                  </div>
                </>
              )}
            </motion.div>

            {/* Content Stats */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="terminal-card"
              >
                <div className="terminal-card-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-xs text-term-gray ml-2">content_stats.log</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-4 gap-2 text-center mb-3">
                    <StatCell label="chars" value={result.content_stats.char_count} />
                    <StatCell label="words" value={result.content_stats.word_count} />
                    <StatCell label="tags" value={result.content_stats.hashtag_count} />
                    <StatCell label="hooks" value={result.content_stats.viral_hooks} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.content_stats.has_question && (
                      <span className="text-[10px] bg-term-bg border border-term-green-dim text-term-green px-2 py-0.5 font-mono">
                        ?_QUESTION
                      </span>
                    )}
                    {result.content_stats.has_cta && (
                      <span className="text-[10px] bg-term-bg border border-term-cyan text-term-cyan px-2 py-0.5 font-mono">
                        !_CTA
                      </span>
                    )}
                    <span className="text-[10px] bg-term-bg border border-term-border text-term-gray px-2 py-0.5 font-mono">
                      {result.content_stats.emotional_tone.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Desktop: Full breakdown */}
            {result && (
              <div className="hidden lg:block space-y-4">
                <ScoreBreakdown
                  signalScores={result.signal_scores}
                  engagementPotential={result.engagement_potential}
                  shareability={result.shareability}
                  controversyRisk={result.controversy_risk}
                  negativeRisk={result.negative_signal_risk}
                />
                <ImprovementTips tips={result.improvements} />
                <GrokAssessment content={analyzedContent} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-term-border text-center">
          <p className="text-term-gray text-xs font-mono">
            Built with{' '}
            <a
              href="https://github.com/AbdelStark/x-algorithm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-green hover:underline"
            >
              X Algorithm
            </a>
            {' | '}
            Grok AI via{' '}
            <a
              href="https://puter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-cyan hover:underline"
            >
              Puter.js
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

function StatCell({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-sm font-mono font-bold text-term-green">{value}</div>
      <div className="text-[10px] text-term-gray uppercase font-mono">{label}</div>
    </div>
  );
}
