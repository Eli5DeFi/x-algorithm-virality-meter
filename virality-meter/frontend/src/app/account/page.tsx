'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AccountSimulationResponse, ImprovementTip } from '@/lib/types';
import { simulateAccount } from '@/lib/api';
import { getTierColor, VIRALITY_TIERS } from '@/lib/tiers';

export default function AccountSimulator() {
  const [result, setResult] = useState<AccountSimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [followersCount, setFollowersCount] = useState(1000);
  const [followingCount, setFollowingCount] = useState(500);
  const [avgLikes, setAvgLikes] = useState(25);
  const [avgReplies, setAvgReplies] = useState(5);
  const [avgRetweets, setAvgRetweets] = useState(3);
  const [postsPerWeek, setPostsPerWeek] = useState(7);
  const [accountAgeDays, setAccountAgeDays] = useState(365);
  const [isVerified, setIsVerified] = useState(false);
  const [niche, setNiche] = useState('tech');

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
            <div className="w-8 h-8 border border-term-cyan rounded flex items-center justify-center">
              <span className="text-term-cyan font-mono text-sm">@</span>
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-term-cyan">
                ACCOUNT_SIMULATOR
              </h1>
              <p className="text-[10px] text-term-gray font-mono">
                Check your account's viral potential
              </p>
            </div>
          </div>
          <Link href="/" className="terminal-btn text-xs py-1.5 px-3">
            CONTENT_ANALYZER
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column - Input Form */}
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
                <span className="text-xs text-term-gray ml-2">account_metrics.conf</span>
              </div>

              <form onSubmit={handleSimulate} className="p-4 space-y-4">
                {/* Followers/Following */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-term-green mb-1 font-mono uppercase">
                      followers
                    </label>
                    <input
                      type="number"
                      value={followersCount}
                      onChange={(e) => setFollowersCount(parseInt(e.target.value) || 0)}
                      className="terminal-input w-full py-2 text-sm"
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
                      className="terminal-input w-full py-2 text-sm"
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
                      <div className="text-[10px] text-term-gray mb-1 font-mono">likes</div>
                      <input
                        type="number"
                        value={avgLikes}
                        onChange={(e) => setAvgLikes(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-term-gray mb-1 font-mono">replies</div>
                      <input
                        type="number"
                        value={avgReplies}
                        onChange={(e) => setAvgReplies(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-term-gray mb-1 font-mono">retweets</div>
                      <input
                        type="number"
                        value={avgRetweets}
                        onChange={(e) => setAvgRetweets(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-1.5 text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      posts_per_week
                    </label>
                    <input
                      type="number"
                      value={postsPerWeek}
                      onChange={(e) => setPostsPerWeek(parseFloat(e.target.value) || 0)}
                      className="terminal-input w-full py-2 text-sm"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      account_age_days
                    </label>
                    <input
                      type="number"
                      value={accountAgeDays}
                      onChange={(e) => setAccountAgeDays(parseInt(e.target.value) || 1)}
                      className="terminal-input w-full py-2 text-sm"
                      min="1"
                    />
                  </div>
                </div>

                {/* Niche & Verification */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase">
                      niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="terminal-input w-full py-2 text-sm"
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
                    <label className="flex items-center gap-2 cursor-pointer terminal-input w-full py-2">
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
                  disabled={loading}
                  className="terminal-btn terminal-btn-primary w-full py-3 disabled:opacity-50"
                >
                  {loading ? (
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

            {/* Error */}
            {error && (
              <div className="bg-term-bg border border-term-red p-3 text-term-red text-xs font-mono">
                [ERROR] {error}
              </div>
            )}

            {/* Presets */}
            <motion.div
              className="terminal-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="terminal-card-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-term-gray ml-2">presets.json</span>
              </div>
              <div className="p-3 flex flex-wrap gap-1.5">
                {[
                  { label: 'small', followers: 100, following: 200, likes: 5, replies: 1, retweets: 0 },
                  { label: 'average', followers: 1000, following: 500, likes: 25, replies: 5, retweets: 3 },
                  { label: 'growing', followers: 50000, following: 1000, likes: 500, replies: 50, retweets: 100 },
                  { label: 'large', followers: 500000, following: 500, likes: 5000, replies: 500, retweets: 1000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setFollowersCount(preset.followers);
                      setFollowingCount(preset.following);
                      setAvgLikes(preset.likes);
                      setAvgReplies(preset.replies);
                      setAvgRetweets(preset.retweets);
                    }}
                    className="terminal-btn text-[10px] py-1 px-2"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Score */}
                  <div className="terminal-card">
                    <div className="terminal-card-header">
                      <div className="terminal-dot terminal-dot-red" />
                      <div className="terminal-dot terminal-dot-yellow" />
                      <div className="terminal-dot terminal-dot-green" />
                      <span className="text-xs text-term-gray ml-2">account_score.exe</span>
                    </div>
                    <div className="p-4">
                      <AccountMeter
                        score={result.overall_score}
                        tierLevel={result.account_tier}
                        tierName={result.account_tier_name}
                        tierEmoji={result.account_tier_emoji}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="terminal-card">
                    <div className="terminal-card-header">
                      <div className="terminal-dot terminal-dot-red" />
                      <div className="terminal-dot terminal-dot-yellow" />
                      <div className="terminal-dot terminal-dot-green" />
                      <span className="text-xs text-term-gray ml-2">metrics.log</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-3">
                      <MetricCell
                        label="engagement_rate"
                        value={`${result.engagement_rate.toFixed(2)}%`}
                        color="green"
                      />
                      <MetricCell
                        label="follower_quality"
                        value={`${Math.round(result.follower_quality_score * 100)}%`}
                        color="cyan"
                      />
                      <MetricCell
                        label="consistency"
                        value={`${Math.round(result.consistency_score * 100)}%`}
                        color="amber"
                      />
                      <MetricCell
                        label="growth_potential"
                        value={`${Math.round(result.growth_potential * 100)}%`}
                        color="green"
                      />
                    </div>
                  </div>

                  {/* Projections */}
                  <div className="terminal-card">
                    <div className="terminal-card-header">
                      <div className="terminal-dot terminal-dot-red" />
                      <div className="terminal-dot terminal-dot-yellow" />
                      <div className="terminal-dot terminal-dot-green" />
                      <span className="text-xs text-term-gray ml-2">projections.dat</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-mono font-bold text-term-green">
                          {result.projected_reach_multiplier}x
                        </div>
                        <div className="text-[10px] text-term-gray uppercase">reach_multiplier</div>
                      </div>
                      <div>
                        <div className="text-2xl font-mono font-bold text-term-cyan">
                          {Math.round(result.viral_post_probability * 100)}%
                        </div>
                        <div className="text-[10px] text-term-gray uppercase">viral_probability</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="terminal-card">
                      <div className="terminal-card-header">
                        <div className="terminal-dot terminal-dot-red" />
                        <div className="terminal-dot terminal-dot-yellow" />
                        <div className="terminal-dot terminal-dot-green" />
                        <span className="text-xs text-term-gray ml-2">recommendations.log</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {result.recommendations.map((rec, i) => (
                          <RecommendationItem key={i} recommendation={rec} index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="terminal-card"
                >
                  <div className="terminal-card-header">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-xs text-term-gray ml-2">account_score.exe</span>
                  </div>
                  <div className="p-8 text-center">
                    <div className="text-term-gray font-mono text-sm">
                      <span className="text-term-cyan animate-blink">_</span> Awaiting metrics...
                    </div>
                    <p className="text-term-gray text-xs font-mono mt-2">
                      Enter account data to simulate
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
}: {
  score: number;
  tierLevel: number;
  tierName: string;
  tierEmoji: string;
}) {
  const tier = VIRALITY_TIERS.find((t) => t.level === tierLevel) || VIRALITY_TIERS[0];
  const color = getTierColor(tier.color);

  return (
    <div className="text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" style={{ color }}>{tierEmoji}</span>
          <div className="text-left">
            <div className="text-4xl font-mono font-bold" style={{ color }}>
              {score}
              <span className="text-lg text-term-gray">/100</span>
            </div>
            <div className="text-[10px] text-term-gray uppercase">account_score</div>
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
      <div className="terminal-progress">
        <motion.div
          className="terminal-progress-bar"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <p className="text-xs text-term-gray mt-3 font-mono">
        &gt; {tier.description}
      </p>
    </div>
  );
}

function MetricCell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: 'text-term-green',
    cyan: 'text-term-cyan',
    amber: 'text-term-amber',
  };

  return (
    <div className="bg-term-bg border border-term-border p-2.5">
      <div className={`text-lg font-mono font-bold ${colorMap[color]}`}>{value}</div>
      <div className="text-[10px] text-term-gray font-mono">{label}</div>
    </div>
  );
}

function RecommendationItem({
  recommendation,
  index,
}: {
  recommendation: ImprovementTip;
  index: number;
}) {
  const priorityConfig: Record<string, { color: string; label: string }> = {
    high: { color: 'text-term-red', label: 'HIGH' },
    medium: { color: 'text-term-amber', label: 'MED' },
    low: { color: 'text-term-cyan', label: 'LOW' },
  };

  const config = priorityConfig[recommendation.priority] || priorityConfig.medium;

  return (
    <motion.div
      className="bg-term-bg border border-term-border p-2.5 text-xs font-mono"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start gap-2">
        <span className={config.color}>[{config.label}]</span>
        <div className="flex-1">
          <p className="text-gray-300">{recommendation.tip}</p>
          <span className="text-term-green">{recommendation.impact}</span>
        </div>
      </div>
    </motion.div>
  );
}
