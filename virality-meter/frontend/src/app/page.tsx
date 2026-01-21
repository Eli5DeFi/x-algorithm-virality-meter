'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentInput from '@/components/ContentInput';
import ViralityMeter from '@/components/ViralityMeter';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import ImprovementTips from '@/components/ImprovementTips';
import GrokAssessment from '@/components/GrokAssessment';
import CombinedResults from '@/components/CombinedResults';
import { ContentAnalysisResponse, AccountSimulationResponse } from '@/lib/types';
import { analyzeContent, simulateAccount } from '@/lib/api';
import { VIRALITY_TIERS, getTierColor } from '@/lib/tiers';

export default function Home() {
  // Post Analysis State
  const [postResult, setPostResult] = useState<ContentAnalysisResponse | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [analyzedContent, setAnalyzedContent] = useState('');

  // Account Simulation State
  const [accountResult, setAccountResult] = useState<AccountSimulationResponse | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Account Form State
  const [followersCount, setFollowersCount] = useState(1000);
  const [followingCount, setFollowingCount] = useState(500);
  const [avgLikes, setAvgLikes] = useState(25);
  const [avgReplies, setAvgReplies] = useState(5);
  const [avgRetweets, setAvgRetweets] = useState(3);
  const [postsPerWeek, setPostsPerWeek] = useState(7);
  const [accountAgeDays, setAccountAgeDays] = useState(365);
  const [isVerified, setIsVerified] = useState(false);
  const [niche, setNiche] = useState('tech');

  const [activeTab, setActiveTab] = useState<'breakdown' | 'tips' | 'grok'>('breakdown');

  const handleAnalyzePost = async (
    content: string,
    hasMedia: boolean,
    mediaType: string,
    videoDuration?: number
  ) => {
    setPostLoading(true);
    setPostError(null);
    setAnalyzedContent(content);

    try {
      const response = await analyzeContent(content, hasMedia, mediaType, videoDuration);
      setPostResult(response);
    } catch (err) {
      setPostError('Connection failed. Ensure backend is running');
      console.error(err);
    } finally {
      setPostLoading(false);
    }
  };

  const handleSimulateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountLoading(true);
    setAccountError(null);

    try {
      const response = await simulateAccount(
        followersCount,
        followingCount,
        avgLikes,
        avgReplies,
        avgRetweets,
        postsPerWeek,
        accountAgeDays,
        isVerified,
        niche
      );
      setAccountResult(response);
    } catch (err) {
      setAccountError('Connection failed. Ensure backend is running');
      console.error(err);
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-term-bg scanlines">
      {/* Header */}
      <header className="border-b border-term-border sticky top-0 bg-term-bg/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-term-green rounded flex items-center justify-center">
              <span className="text-term-green font-mono text-sm">X</span>
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-term-green">
                VIRALITY_METER
              </h1>
              <p className="text-[10px] text-term-gray font-mono">
                Unified Account + Content Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
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
          {/* Left Column - Inputs */}
          <div className="space-y-4">
            {/* Account Metrics Input */}
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="terminal-card-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-term-gray ml-2">account_metrics.conf</span>
              </div>

              <form onSubmit={handleSimulateAccount} className="p-4 space-y-3">
                {/* Followers/Following */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-term-green mb-1 font-mono uppercase">
                      followers
                    </label>
                    <input
                      type="number"
                      value={followersCount}
                      onChange={(e) => setFollowersCount(parseInt(e.target.value) || 0)}
                      className="terminal-input w-full py-1.5 text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-term-cyan mb-1 font-mono uppercase">
                      following
                    </label>
                    <input
                      type="number"
                      value={followingCount}
                      onChange={(e) => setFollowingCount(parseInt(e.target.value) || 0)}
                      className="terminal-input w-full py-1.5 text-sm"
                      min="0"
                    />
                  </div>
                </div>

                {/* Average Engagement */}
                <div>
                  <label className="block text-[10px] text-term-amber mb-1 font-mono uppercase">
                    avg_engagement_per_post
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[9px] text-term-gray mb-1 font-mono">likes</div>
                      <input
                        type="number"
                        value={avgLikes}
                        onChange={(e) => setAvgLikes(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <div className="text-[9px] text-term-gray mb-1 font-mono">replies</div>
                      <input
                        type="number"
                        value={avgReplies}
                        onChange={(e) => setAvgReplies(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <div className="text-[9px] text-term-gray mb-1 font-mono">retweets</div>
                      <input
                        type="number"
                        value={avgRetweets}
                        onChange={(e) => setAvgRetweets(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1 text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      posts/week
                    </label>
                    <input
                      type="number"
                      value={postsPerWeek}
                      onChange={(e) => setPostsPerWeek(parseFloat(e.target.value) || 0)}
                      className="terminal-input w-full py-1.5 text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      age_days
                    </label>
                    <input
                      type="number"
                      value={accountAgeDays}
                      onChange={(e) => setAccountAgeDays(parseInt(e.target.value) || 1)}
                      className="terminal-input w-full py-1.5 text-sm"
                      min="1"
                    />
                  </div>
                </div>

                {/* Niche & Verification */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="terminal-input w-full py-1.5 text-sm"
                    >
                      <option value="tech">tech</option>
                      <option value="crypto">crypto</option>
                      <option value="politics">politics</option>
                      <option value="entertainment">entertainment</option>
                      <option value="sports">sports</option>
                      <option value="business">business</option>
                      <option value="lifestyle">lifestyle</option>
                      <option value="gaming">gaming</option>
                      <option value="other">other</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer terminal-input w-full py-1.5">
                      <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="w-3 h-3"
                      />
                      <span className="text-xs font-mono text-term-gray">--verified</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={accountLoading}
                  className="terminal-btn terminal-btn-primary w-full py-2 disabled:opacity-50"
                >
                  {accountLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">◌</span>
                      SIMULATING...
                    </span>
                  ) : (
                    <span>&gt; SIMULATE_ACCOUNT</span>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Account Error */}
            {accountError && (
              <div className="bg-term-bg border border-term-red p-3 text-term-red text-xs font-mono">
                [ERROR] {accountError}
              </div>
            )}

            {/* Content Input */}
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="terminal-card-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-term-gray ml-2">content_input.sh</span>
              </div>
              <div className="p-4">
                <ContentInput onAnalyze={handleAnalyzePost} loading={postLoading} />
              </div>
            </motion.div>

            {/* Post Error */}
            {postError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-term-bg border border-term-red p-3 text-term-red text-xs font-mono"
              >
                [ERROR] {postError}
              </motion.div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {/* Account Score */}
            {accountResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="terminal-card"
              >
                <div className="terminal-card-header">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-xs text-term-gray ml-2">account_score.exe</span>
                </div>
                <div className="p-4">
                  <AccountMeter
                    score={accountResult.overall_score}
                    tierLevel={accountResult.account_tier}
                    tierName={accountResult.account_tier_name}
                    tierEmoji={accountResult.account_tier_emoji}
                    multiplier={accountResult.projected_reach_multiplier}
                  />
                </div>
              </motion.div>
            )}

            {/* Post Virality Meter */}
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {postResult ? (
                <ViralityMeter
                  score={postResult.score}
                  tierLevel={postResult.tier_level}
                  tierName={postResult.tier_name}
                  tierEmoji={postResult.tier_emoji}
                  tierDescription={postResult.tier_description}
                  tierColor={postResult.tier_color}
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

            {/* Combined Results */}
            <CombinedResults accountResult={accountResult} postResult={postResult} />

            {/* Content Stats */}
            {postResult && (
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
                    <StatCell label="chars" value={postResult.content_stats.char_count} />
                    <StatCell label="words" value={postResult.content_stats.word_count} />
                    <StatCell label="tags" value={postResult.content_stats.hashtag_count} />
                    <StatCell label="hooks" value={postResult.content_stats.viral_hooks} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {postResult.content_stats.has_question && (
                      <span className="text-[10px] bg-term-bg border border-term-green-dim text-term-green px-2 py-0.5 font-mono">
                        ?_QUESTION
                      </span>
                    )}
                    {postResult.content_stats.has_cta && (
                      <span className="text-[10px] bg-term-bg border border-term-cyan text-term-cyan px-2 py-0.5 font-mono">
                        !_CTA
                      </span>
                    )}
                    <span className="text-[10px] bg-term-bg border border-term-border text-term-gray px-2 py-0.5 font-mono">
                      {postResult.content_stats.emotional_tone.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Desktop: Full breakdown */}
            {postResult && (
              <div className="hidden lg:block space-y-4">
                <ScoreBreakdown
                  signalScores={postResult.signal_scores}
                  engagementPotential={postResult.engagement_potential}
                  shareability={postResult.shareability}
                  controversyRisk={postResult.controversy_risk}
                  negativeRisk={postResult.negative_signal_risk}
                />
                <ImprovementTips tips={postResult.improvements} />
                <GrokAssessment content={analyzedContent} />
              </div>
            )}

            {/* Mobile Tabs */}
            {postResult && (
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
                      className={`flex-1 py-1.5 text-[10px] font-mono transition-all ${activeTab === tab.id
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
                        signalScores={postResult.signal_scores}
                        engagementPotential={postResult.engagement_potential}
                        shareability={postResult.shareability}
                        controversyRisk={postResult.controversy_risk}
                        negativeRisk={postResult.negative_signal_risk}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'tips' && (
                    <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ImprovementTips tips={postResult.improvements} />
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
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-term-border text-center">
          <p className="text-term-gray text-xs font-mono">
            Based on{' '}
            <a
              href="https://github.com/AbdelStark/x-algorithm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-green hover:underline"
            >
              AbdelStark/x-algorithm
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

function AccountMeter({
  score,
  tierLevel,
  tierName,
  tierEmoji,
  multiplier,
}: {
  score: number;
  tierLevel: number;
  tierName: string;
  tierEmoji: string;
  multiplier: number;
}) {
  const tier = VIRALITY_TIERS.find((t) => t.level === tierLevel) || VIRALITY_TIERS[0];
  const color = getTierColor(tier.color);

  return (
    <div className="text-center">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" style={{ color }}>{tierEmoji}</span>
          <div className="text-left">
            <div className="text-3xl font-mono font-bold" style={{ color }}>
              {score}
              <span className="text-sm text-term-gray">/100</span>
            </div>
            <div className="text-[9px] text-term-gray uppercase">account_score</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="terminal-badge text-[10px]"
            style={{
              background: `${color}15`,
              borderColor: `${color}40`,
              color,
            }}
          >
            TIER_{tierLevel}
          </div>
          <div className="text-xs font-mono mt-1" style={{ color }}>
            {tierName}
          </div>
          <div className="text-[10px] text-term-gray mt-0.5">
            {multiplier}x reach
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="terminal-progress">
        <motion.div
          className="terminal-progress-bar"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <p className="text-[10px] text-term-gray mt-2 font-mono">
        &gt; {tier.description}
      </p>
    </div>
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
