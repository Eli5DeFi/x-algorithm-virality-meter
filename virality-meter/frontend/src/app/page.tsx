'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import ImprovementTips from '@/components/ImprovementTips';
import XAlgorithmParams from '@/components/XAlgorithmParams';
import DiversityScore from '@/components/DiversityScore';
import Tooltip from '@/components/Tooltip';
import { analyzeContent, ContentAnalysisResponse } from '@/lib/api';
import { VIRALITY_TIERS } from '@/lib/tiers';
import { getTierForScore, getTierColor } from '@/lib/tiers';

// Account size templates
const ACCOUNT_TEMPLATES = [
  { label: 'Micro', followers: 500, following: 300, likes: 10, replies: 2, retweets: 1, description: '<1K followers' },
  { label: 'Small', followers: 5000, following: 1000, likes: 50, replies: 10, retweets: 5, description: '1K-10K followers' },
  { label: 'Medium', followers: 25000, following: 2000, likes: 200, replies: 30, retweets: 25, description: '10K-50K followers' },
  { label: 'Med-Large', followers: 100000, following: 3000, likes: 800, replies: 100, retweets: 150, description: '50K-250K followers' },
  { label: 'Large', followers: 500000, following: 2000, likes: 5000, replies: 500, retweets: 1000, description: '250K+ followers' },
];

// Field tooltips
const TOOLTIPS = {
  followers: 'Total number of accounts following you',
  following: 'Total number of accounts you follow',
  likes: 'Average likes per post over last 30 days',
  replies: 'Average replies/comments per post',
  retweets: 'Average retweets/reposts per post',
  postsPerWeek: 'How many times you post per week on average',
  accountAge: 'How long your account has existed in days',
  niche: 'Primary topic/industry of your content',
  verified: 'X Premium (formerly Twitter Blue) subscriber',
  contentType: 'Format of your post (affects optimal length)',
  media: 'Include image, video, GIF, or poll',
};

export default function Home() {
  const [result, setResult] = useState<ContentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'tips' | 'diversity' | 'params'>('breakdown');

  // Form state - Content
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('short');
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaType, setMediaType] = useState('none');
  const [videoDuration, setVideoDuration] = useState<number | undefined>();

  // Content type options
  const CONTENT_TYPES = [
    { value: 'short', label: 'Short Tweet', description: 'Standard tweet under 280 chars' },
    { value: 'thread', label: 'Thread', description: 'Multi-tweet thread (1/, 2/, etc.)' },
    { value: 'longform', label: 'Long Form', description: 'Extended post over 280 chars' },
    { value: 'quote', label: 'Quote RT', description: 'Quote retweet with commentary' },
    { value: 'article', label: 'Article', description: 'X article or long-form note' },
  ];

  // Form state - Account
  const [followersCount, setFollowersCount] = useState(1000);
  const [followingCount, setFollowingCount] = useState(500);
  const [avgLikes, setAvgLikes] = useState(25);
  const [avgReplies, setAvgReplies] = useState(5);
  const [avgRetweets, setAvgRetweets] = useState(3);
  const [postsPerWeek, setPostsPerWeek] = useState(7);
  const [accountAgeDays, setAccountAgeDays] = useState(365);
  const [isVerified, setIsVerified] = useState(false);
  const [niche, setNiche] = useState('tech');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeContent(content, hasMedia, mediaType, videoDuration);
      setResult(response);
    } catch (err) {
      setError('Connection failed. Please check the backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: typeof ACCOUNT_TEMPLATES[0]) => {
    setFollowersCount(template.followers);
    setFollowingCount(template.following);
    setAvgLikes(template.likes);
    setAvgReplies(template.replies);
    setAvgRetweets(template.retweets);
  };

  const charCount = content.length;

  const examplePosts = [
    { label: 'Hot Take', text: 'Unpopular opinion: Tabs are better than spaces and I will die on this hill. Fight me.' },
    { label: 'Thread', text: 'Thread: 10 things I learned building a startup that nobody talks about 🧵\n\n1/ Most "overnight successes" took 10 years...' },
    { label: 'Question', text: 'What\'s the one piece of advice you wish someone gave you when you started your career? I\'ll go first...' },
  ];

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
          {/* Left Column - Input Form */}
          <div className="space-y-4">
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Content Input Card */}
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
                <div className="p-4 space-y-3">
                  {/* Text Input - No character limit */}
                  <div className="relative">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your post content to analyze... (threads, long-form, articles all supported)"
                      className="terminal-input w-full h-32 resize-none text-sm"
                      disabled={loading}
                    />
                    <div className="absolute bottom-2 right-2 text-xs font-mono text-term-gray">
                      {charCount} chars
                    </div>
                  </div>

                  {/* Quick Examples */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs text-term-gray font-mono">templates:</span>
                    {examplePosts.map((example, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setContent(example.text)}
                        className="text-xs px-2 py-0.5 bg-term-bg border border-term-border rounded text-term-gray hover:text-term-green hover:border-term-green-dim transition-colors font-mono"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>

                  {/* Media Options */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <Tooltip content={TOOLTIPS.media}>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasMedia}
                          onChange={(e) => {
                            setHasMedia(e.target.checked);
                            if (!e.target.checked) {
                              setMediaType('none');
                              setVideoDuration(undefined);
                            }
                          }}
                          className="w-3 h-3"
                        />
                        <span className="text-term-gray hover:text-term-green">--media</span>
                      </label>
                    </Tooltip>

                    {hasMedia && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                      >
                        <select
                          value={mediaType}
                          onChange={(e) => setMediaType(e.target.value)}
                          className="terminal-input py-1 px-2 text-xs"
                        >
                          <option value="image">image</option>
                          <option value="video">video</option>
                          <option value="gif">gif</option>
                          <option value="poll">poll</option>
                        </select>

                        {mediaType === 'video' && (
                          <input
                            type="number"
                            placeholder="sec"
                            value={videoDuration ? videoDuration / 1000 : ''}
                            onChange={(e) => setVideoDuration(parseFloat(e.target.value) * 1000 || undefined)}
                            className="terminal-input w-16 py-1 px-2 text-xs"
                            min="1"
                            max="600"
                          />
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Content Type Selector */}
                  <div>
                    <Tooltip content={TOOLTIPS.contentType}>
                      <label className="block text-[10px] text-term-cyan mb-1.5 font-mono uppercase cursor-help">
                        content_type
                      </label>
                    </Tooltip>
                    <div className="flex flex-wrap gap-1.5">
                      {CONTENT_TYPES.map((type) => (
                        <Tooltip key={type.value} content={type.description}>
                          <button
                            type="button"
                            onClick={() => setContentType(type.value)}
                            className={`text-[10px] px-2 py-1 border rounded font-mono transition-colors ${
                              contentType === type.value
                                ? 'bg-term-cyan/20 border-term-cyan text-term-cyan'
                                : 'bg-term-bg border-term-border text-term-gray hover:text-term-cyan hover:border-term-cyan'
                            }`}
                          >
                            {type.label}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Metrics Card */}
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
                  <span className="text-xs text-term-gray ml-2">account_metrics.conf</span>
                </div>
                <div className="p-4 space-y-3">
                  {/* Account Size Templates */}
                  <div>
                    <label className="block text-[10px] text-term-cyan mb-1.5 font-mono uppercase">
                      account_size_preset
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ACCOUNT_TEMPLATES.map((template) => (
                        <Tooltip key={template.label} content={template.description}>
                          <button
                            type="button"
                            onClick={() => applyTemplate(template)}
                            className="text-[10px] px-2 py-1 bg-term-bg border border-term-border rounded text-term-gray hover:text-term-cyan hover:border-term-cyan transition-colors font-mono"
                          >
                            {template.label}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>

                  {/* Followers/Following */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Tooltip content={TOOLTIPS.followers}>
                        <label className="block text-[10px] text-term-green mb-1 font-mono uppercase cursor-help">
                          followers
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={followersCount}
                        onChange={(e) => setFollowersCount(parseInt(e.target.value) || 0)}
                        className="terminal-input w-full py-2 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <Tooltip content={TOOLTIPS.following}>
                        <label className="block text-[10px] text-term-cyan mb-1 font-mono uppercase cursor-help">
                          following
                        </label>
                      </Tooltip>
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
                        <Tooltip content={TOOLTIPS.likes}>
                          <div className="text-[10px] text-term-gray mb-1 font-mono cursor-help">likes</div>
                        </Tooltip>
                        <input
                          type="number"
                          value={avgLikes}
                          onChange={(e) => setAvgLikes(parseFloat(e.target.value) || 0)}
                          className="terminal-input w-full py-1.5 text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <Tooltip content={TOOLTIPS.replies}>
                          <div className="text-[10px] text-term-gray mb-1 font-mono cursor-help">replies</div>
                        </Tooltip>
                        <input
                          type="number"
                          value={avgReplies}
                          onChange={(e) => setAvgReplies(parseFloat(e.target.value) || 0)}
                          className="terminal-input w-full py-1.5 text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <Tooltip content={TOOLTIPS.retweets}>
                          <div className="text-[10px] text-term-gray mb-1 font-mono cursor-help">retweets</div>
                        </Tooltip>
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

                  {/* Activity & Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Tooltip content={TOOLTIPS.postsPerWeek}>
                        <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase cursor-help">
                          posts_per_week
                        </label>
                      </Tooltip>
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
                      <Tooltip content={TOOLTIPS.accountAge}>
                        <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase cursor-help">
                          account_age_days
                        </label>
                      </Tooltip>
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
                      <Tooltip content={TOOLTIPS.niche}>
                        <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase cursor-help">
                          niche
                        </label>
                      </Tooltip>
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
                      <Tooltip content={TOOLTIPS.verified}>
                        <label className="flex items-center gap-2 cursor-pointer terminal-input w-full py-2">
                          <input
                            type="checkbox"
                            checked={isVerified}
                            onChange={(e) => setIsVerified(e.target.checked)}
                            className="w-3 h-3"
                          />
                          <span className="text-xs font-mono text-term-gray">--verified</span>
                        </label>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="terminal-btn terminal-btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">◌</span>
                    ANALYZING...
                  </span>
                ) : (
                  <span>&gt; ANALYZE_VIRALITY</span>
                )}
              </button>
            </form>

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
                <div className="flex gap-1 mb-3 overflow-x-auto">
                  {[
                    { id: 'breakdown', label: 'SCORE' },
                    { id: 'tips', label: 'TIPS' },
                    { id: 'diversity', label: 'DIVERSITY' },
                    { id: 'params', label: 'X_PARAMS' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 py-1.5 text-[10px] font-mono transition-all whitespace-nowrap ${
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
                  {activeTab === 'diversity' && result.diversity && (
                    <motion.div key="diversity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <DiversityScore diversity={result.diversity} />
                    </motion.div>
                  )}
                  {activeTab === 'params' && (
                    <motion.div key="params" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <XAlgorithmParams />
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
                <>
                  <div className="terminal-card-header">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-xs text-term-gray ml-2">virality_score.exe</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="text-3xl"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: getTierColor(result.tier_color) }}
                        >
                          {result.tier_emoji}
                        </motion.span>
                        <div>
                          <motion.div
                            className="text-4xl font-mono font-bold"
                            style={{ color: getTierColor(result.tier_color) }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {result.score}
                            <span className="text-lg text-term-gray">/100</span>
                          </motion.div>
                          <div className="text-[10px] text-term-gray uppercase">virality_index</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="terminal-badge"
                          style={{
                            background: `${getTierColor(result.tier_color)}15`,
                            borderColor: `${getTierColor(result.tier_color)}40`,
                            color: getTierColor(result.tier_color),
                          }}
                        >
                          TIER_{result.tier_level}
                        </div>
                        <div className="text-sm font-mono mt-1" style={{ color: getTierColor(result.tier_color) }}>
                          {result.tier_name}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="terminal-progress mb-3">
                      <motion.div
                        className="terminal-progress-bar"
                        style={{ backgroundColor: getTierColor(result.tier_color) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>

                    <p className="text-xs text-term-gray font-mono">
                      &gt; {result.tier_description}
                    </p>
                  </div>
                </>
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
                    <StatCell label="chars" value={result.content_stats.char_count} tooltip="Character count" />
                    <StatCell label="words" value={result.content_stats.word_count} tooltip="Word count" />
                    <StatCell label="tags" value={result.content_stats.hashtag_count} tooltip="Hashtag count (1-2 optimal)" />
                    <StatCell label="hooks" value={result.content_stats.viral_hooks} tooltip="Viral hook patterns detected" />
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
                {result.diversity && <DiversityScore diversity={result.diversity} />}
                <ImprovementTips tips={result.improvements} />
                <XAlgorithmParams />
              </div>
            )}

            {/* Show X Algorithm Params even without results */}
            {!result && (
              <div className="hidden lg:block">
                <XAlgorithmParams />
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

function StatCell({ label, value, tooltip }: { label: string; value: number | string; tooltip?: string }) {
  const content = (
    <div>
      <div className="text-sm font-mono font-bold text-term-green">{value}</div>
      <div className="text-[10px] text-term-gray uppercase font-mono">{label}</div>
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }
  return content;
}
