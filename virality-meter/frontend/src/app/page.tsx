'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ViralityMeter from '@/components/ViralityMeter';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import Actionables from '@/components/Actionables';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { analyzeCombined, CombinedAnalysisResponse } from '@/lib/api';
import { VIRALITY_TIERS, ALGORITHM_SIGNALS } from '@/lib/tiers';

export default function Home() {
  const [result, setResult] = useState<CombinedAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedContent, setAnalyzedContent] = useState('');
  const [activeTab, setActiveTab] = useState<'breakdown' | 'actionables'>('breakdown');

  // Form state - Content
  const [content, setContent] = useState('');
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaType, setMediaType] = useState('none');
  const [videoDuration, setVideoDuration] = useState<number | undefined>();
  const [contentType, setContentType] = useState<'short' | 'thread' | 'article' | 'longform' | 'quote'>('short');

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
    setAnalyzedContent(content);

    try {
      const response = await analyzeCombined({
        content,
        hasMedia,
        mediaType,
        videoDuration,
        contentType,
        followersCount,
        followingCount,
        avgLikes,
        avgReplies,
        avgRetweets,
        postsPerWeek,
        accountAgeDays,
        isVerified,
        niche,
      });
      setResult(response);
    } catch (err) {
      setError('Connection failed. Ensure backend is running on localhost:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;
  const warningThreshold = 1000;
  const isVeryLong = charCount > 2000;

  const accountTemplates = [
    {
      label: 'Micro',
      icon: '🌱',
      followers: 5000,
      following: 2000,
      likes: 50,
      replies: 10,
      retweets: 5,
      posts: 7,
      age: 180,
      verified: false,
      tooltip: '<10k followers - Building presence'
    },
    {
      label: 'Small',
      icon: '📈',
      followers: 25000,
      following: 5000,
      likes: 200,
      replies: 30,
      retweets: 25,
      posts: 10,
      age: 365,
      verified: false,
      tooltip: '10k-50k followers - Growing influence'
    },
    {
      label: 'Medium',
      icon: '🚀',
      followers: 75000,
      following: 3000,
      likes: 500,
      replies: 80,
      retweets: 100,
      posts: 14,
      age: 730,
      verified: true,
      tooltip: '50k-100k followers - Established voice'
    },
    {
      label: 'Med-Large',
      icon: '⭐',
      followers: 250000,
      following: 2000,
      likes: 2000,
      replies: 150,
      retweets: 300,
      posts: 21,
      age: 1095,
      verified: true,
      tooltip: '100k-500k followers - Significant reach'
    },
    {
      label: 'Large',
      icon: '👑',
      followers: 750000,
      following: 1000,
      likes: 5000,
      replies: 300,
      retweets: 800,
      posts: 28,
      age: 1825,
      verified: true,
      tooltip: '500k+ followers - Major influencer'
    },
  ];

  const applyTemplate = (template: typeof accountTemplates[0]) => {
    setFollowersCount(template.followers);
    setFollowingCount(template.following);
    setAvgLikes(template.likes);
    setAvgReplies(template.replies);
    setAvgRetweets(template.retweets);
    setPostsPerWeek(template.posts);
    setAccountAgeDays(template.age);
    setIsVerified(template.verified);
  };

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
                Combined Account & Post Analysis
              </p>
            </div>
          </div>
          <Link
            href="/algorithm"
            className="text-[10px] text-term-cyan hover:text-term-green font-mono flex items-center gap-1 transition-colors"
          >
            <span>[?]</span>
            <span>X_ALGORITHM_DOCS</span>
          </Link>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

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
          {/* Left Column - Combined Input Form */}
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
                  {/* Text Input */}
                  <div className="relative group">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter content to analyze (threads, long-form, tweets, etc.)..."
                      className={`terminal-input w-full h-32 resize-y text-sm ${isVeryLong ? 'border-term-amber' : ''
                        }`}
                      disabled={loading}
                      title="No character limit - analyze any content length"
                    />
                    <div className={`absolute bottom-2 right-2 text-xs font-mono ${isVeryLong ? 'text-term-amber' : charCount > warningThreshold ? 'text-term-cyan' : 'text-term-gray'
                      }`}>
                      {charCount.toLocaleString()} chars
                      {isVeryLong && <span className="ml-1">⚠</span>}
                    </div>
                  </div>

                  {/* Content Type Selector */}
                  <div>
                    <label className="block text-[10px] text-term-cyan mb-1.5 font-mono uppercase" title="Content format affects engagement patterns">
                      content_type
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'short', label: 'Short Tweet', tooltip: 'Standard tweet (1.0x base)' },
                        { value: 'thread', label: 'Thread', tooltip: 'Multi-tweet thread (1.15x boost)' },
                        { value: 'article', label: 'Article', tooltip: 'Link to article (1.05x boost)' },
                        { value: 'longform', label: 'Long-Form', tooltip: 'Extended content (0.95x)' },
                        { value: 'quote', label: 'Quote Retweet', tooltip: 'Quote with context (1.1x boost)' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setContentType(type.value as typeof contentType)}
                          title={type.tooltip}
                          className={`text-[10px] px-2 py-1 font-mono transition-colors ${contentType === type.value
                            ? 'bg-term-cyan text-term-bg'
                            : 'bg-term-bg border border-term-border text-term-gray hover:border-term-cyan'
                            }`}
                        >
                          {type.label}
                        </button>
                      ))}
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
                      <span className="text-term-gray">--media</span>
                    </label>

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
                            placeholder="duration_ms"
                            value={videoDuration ? videoDuration / 1000 : ''}
                            onChange={(e) => setVideoDuration(parseFloat(e.target.value) * 1000 || undefined)}
                            className="terminal-input w-20 py-1 px-2 text-xs"
                            min="1"
                            max="600"
                          />
                        )}
                      </motion.div>
                    )}
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
                  {/* Account Templates */}
                  <div>
                    <label className="block text-[10px] text-term-amber mb-1.5 font-mono uppercase" title="Quick presets for different account sizes">
                      account_templates
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {accountTemplates.map((template) => (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => applyTemplate(template)}
                          title={template.tooltip}
                          className="text-[10px] px-2 py-1 font-mono bg-term-bg border border-term-border text-term-gray hover:border-term-amber hover:text-term-amber transition-colors flex items-center gap-1"
                        >
                          <span>{template.icon}</span>
                          <span>{template.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Followers/Following */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-term-green mb-1 font-mono uppercase" title="Your total follower count - key metric for reach">
                        followers
                      </label>
                      <input
                        type="number"
                        value={followersCount}
                        onChange={(e) => setFollowersCount(parseInt(e.target.value) || 0)}
                        className="terminal-input w-full py-2 text-sm"
                        min="0"
                        title="Total followers"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-term-cyan mb-1 font-mono uppercase" title="Accounts you follow - affects follower quality ratio">
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
                    <label className="block text-[10px] text-term-amber mb-1 font-mono uppercase" title="Average engagement metrics per post - critical for engagement rate">
                      avg_engagement_per_post
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10px] text-term-gray mb-1 font-mono" title="Avg likes per post">likes</div>
                        <input
                          type="number"
                          value={avgLikes}
                          onChange={(e) => setAvgLikes(parseFloat(e.target.value) || 0)}
                          className="terminal-input w-full py-1.5 text-sm"
                          min="0"
                          title="Average likes per post"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-term-gray mb-1 font-mono" title="Avg replies per post - high value signal">replies</div>
                        <input
                          type="number"
                          value={avgReplies}
                          onChange={(e) => setAvgReplies(parseFloat(e.target.value) || 0)}
                          className="terminal-input w-full py-1.5 text-sm"
                          min="0"
                          title="Average replies per post"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-term-gray mb-1 font-mono" title="Avg retweets per post - amplification signal">retweets</div>
                        <input
                          type="number"
                          value={avgRetweets}
                          onChange={(e) => setAvgRetweets(parseFloat(e.target.value) || 0)}
                          className="terminal-input w-full py-1.5 text-sm"
                          min="0"
                          title="Average retweets per post"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Activity & Age */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase" title="Posting frequency - consistency matters (1-5 posts/day optimal)">
                        posts_per_week
                      </label>
                      <input
                        type="number"
                        value={postsPerWeek}
                        onChange={(e) => setPostsPerWeek(parseFloat(e.target.value) || 0)}
                        className="terminal-input w-full py-2 text-sm"
                        min="0"
                        step="0.5"
                        title="Posts per week (7-35 is typical)"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase" title="Account age in days - older accounts have more authority">
                        account_age_days
                      </label>
                      <input
                        type="number"
                        value={accountAgeDays}
                        onChange={(e) => setAccountAgeDays(parseInt(e.target.value) || 1)}
                        className="terminal-input w-full py-2 text-sm"
                        min="1"
                        title="Account age in days"
                      />
                    </div>
                  </div>

                  {/* Niche & Verification */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-term-gray mb-1 font-mono uppercase" title="Content category/niche">
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
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    { id: 'actionables', label: 'ACTIONS' },
                    { id: 'breakdown', label: 'BREAKDOWN' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`py-1.5 text-[10px] font-mono transition-all ${activeTab === tab.id
                        ? 'bg-term-green text-term-bg'
                        : 'bg-term-bg-light text-term-gray border border-term-border hover:border-term-green-dim'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'actionables' && (
                    <motion.div key="actionables" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Actionables
                        postScore={result.post_score}
                        accountScore={result.account_score}
                        aggregateScore={result.aggregate_score}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'breakdown' && (
                    <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ScoreBreakdown
                        signalScores={result.post_score.signal_scores}
                        engagementPotential={result.post_score.engagement_potential}
                        shareability={result.post_score.shareability}
                        controversyRisk={result.post_score.controversy_risk}
                        negativeRisk={result.post_score.negative_signal_risk}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'breakdown' && (
                    <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ScoreBreakdown
                        signalScores={result.post_score.signal_scores}
                        engagementPotential={result.post_score.engagement_potential}
                        shareability={result.post_score.shareability}
                        controversyRisk={result.post_score.controversy_risk}
                        negativeRisk={result.post_score.negative_signal_risk}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Aggregate Score - Main Neonic Box */}
                <motion.div
                  className="relative border-2 border-term-cyan bg-gradient-to-br from-term-cyan/5 via-term-bg to-term-cyan/10 shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="terminal-card-header bg-term-cyan/10">
                    <div className="terminal-dot terminal-dot-red" />
                    <div className="terminal-dot terminal-dot-yellow" />
                    <div className="terminal-dot terminal-dot-green" />
                    <span className="text-xs text-term-cyan ml-2 font-bold">AGGREGATE_SCORE.exe</span>
                  </div>
                  <div className="p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-5xl">{result.aggregate_tier_emoji}</span>
                        <div>
                          <div className="text-5xl font-mono font-bold text-term-cyan">
                            {result.aggregate_score}
                            <span className="text-2xl text-term-gray">/100</span>
                          </div>
                          <div className="text-xs text-term-gray uppercase">combined virality</div>
                        </div>
                      </div>
                      <div className="terminal-badge bg-term-cyan/20 border-term-cyan text-term-cyan">
                        TIER_{result.aggregate_tier_level}: {result.aggregate_tier_name}
                      </div>
                      <p className="text-xs text-gray-300 mt-3 font-mono">
                        &gt; {result.aggregate_tier_description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Breakdown: Account + Post Scores */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Account Score - Neonic Box */}
                  <motion.div
                    className="relative border-2 border-term-green bg-gradient-to-br from-term-green/5 via-term-bg to-term-green/10 shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="terminal-card-header bg-term-green/10">
                      <div className="terminal-dot terminal-dot-red" />
                      <div className="terminal-dot terminal-dot-yellow" />
                      <div className="terminal-dot terminal-dot-green" />
                      <span className="text-[10px] text-term-green ml-2 font-bold">ACCOUNT</span>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-xl">{result.account_score.account_tier_emoji}</div>
                      <div className="text-3xl font-mono font-bold text-term-green">
                        {result.account_score.overall_score}
                      </div>
                      <div className="text-[10px] text-term-gray uppercase">account_score</div>
                      <div className="mt-2 text-[10px] bg-term-green/10 border border-term-green/30 px-2 py-1 text-term-green font-mono">
                        T{result.account_score.account_tier}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-2 font-mono">
                        {VIRALITY_TIERS.find(t => t.level === result.account_score.account_tier)?.description}
                      </div>
                    </div>
                  </motion.div>

                  {/* Post Score - Neonic Box */}
                  <motion.div
                    className="relative border-2 border-term-amber bg-gradient-to-br from-term-amber/5 via-term-bg to-term-amber/10 shadow-[0_0_20px_rgba(255,176,0,0.2)]"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="terminal-card-header bg-term-amber/10">
                      <div className="terminal-dot terminal-dot-red" />
                      <div className="terminal-dot terminal-dot-yellow" />
                      <div className="terminal-dot terminal-dot-green" />
                      <span className="text-[10px] text-term-amber ml-2 font-bold">POST</span>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-xl">{result.post_score.tier_emoji}</div>
                      <div className="text-3xl font-mono font-bold text-term-amber">
                        {result.post_score.score}
                      </div>
                      <div className="text-[10px] text-term-gray uppercase">post_score</div>
                      <div className="mt-2 text-[10px] bg-term-amber/10 border border-term-amber/30 px-2 py-1 text-term-amber font-mono">
                        T{result.post_score.tier_level}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-2 font-mono">
                        {result.post_score.tier_description}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div
                className="terminal-card"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
              >
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
              </motion.div>
            )}

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
                    <StatCell label="chars" value={result.post_score.content_stats.char_count} />
                    <StatCell label="words" value={result.post_score.content_stats.word_count} />
                    <StatCell label="tags" value={result.post_score.content_stats.hashtag_count} />
                    <StatCell label="hooks" value={result.post_score.content_stats.viral_hooks} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {result.post_score.content_stats.has_question && (
                      <span className="text-[10px] bg-term-bg border border-term-green-dim text-term-green px-2 py-0.5 font-mono">
                        ?_QUESTION
                      </span>
                    )}
                    {result.post_score.content_stats.has_cta && (
                      <span className="text-[10px] bg-term-bg border border-term-cyan text-term-cyan px-2 py-0.5 font-mono">
                        !_CTA
                      </span>
                    )}
                    <span className="text-[10px] bg-term-bg border border-term-border text-term-gray px-2 py-0.5 font-mono">
                      {result.post_score.content_stats.emotional_tone.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* X Algorithm Parameters Box */}
            {result && (
              <motion.div
                className="terminal-card border-2 border-term-cyan/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="terminal-card-header bg-term-cyan/10">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-xs text-term-cyan ml-2 font-bold">X_ALGORITHM_PARAMS.rs</span>
                </div>
                <div className="p-3 space-y-3">
                  <div className="text-xs text-term-gray font-mono">
                    <span className="text-term-green">$</span> cat phoenix_scorer.rs
                  </div>

                  {/* Positive Signals */}
                  <div>
                    <div className="text-[10px] text-term-green uppercase mb-1.5 font-mono">
                      // POSITIVE SIGNALS (boost)
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {ALGORITHM_SIGNALS.positive.map((signal) => (
                        <div
                          key={signal.key}
                          className="flex items-center gap-1.5 text-[10px] font-mono"
                          title={signal.description}
                        >
                          <span className="text-term-green">+</span>
                          <span className="text-term-gray">{signal.label}</span>
                          <span className={`ml-auto ${signal.weight === 'HIGH' ? 'text-term-green' :
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
                    <div className="text-[10px] text-term-red uppercase mb-1.5 font-mono">
                      // NEGATIVE SIGNALS (penalty)
                    </div>
                    <div className="space-y-0.5">
                      {ALGORITHM_SIGNALS.negative.map((signal) => (
                        <div
                          key={signal.key}
                          className="flex items-center gap-1.5 text-[10px] font-mono"
                          title={signal.description}
                        >
                          <span className="text-term-red">-</span>
                          <span className="text-term-gray">{signal.label}</span>
                          <span className="text-term-red ml-auto">{signal.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-term-gray pt-2 border-t border-term-border font-mono">
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

            {/* Desktop: Full breakdown */}
            {result && (
              <div className="hidden lg:block space-y-4">
                <Actionables
                  postScore={result.post_score}
                  accountScore={result.account_score}
                  aggregateScore={result.aggregate_score}
                />
                <ScoreBreakdown
                  signalScores={result.post_score.signal_scores}
                  engagementPotential={result.post_score.engagement_potential}
                  shareability={result.post_score.shareability}
                  controversyRisk={result.post_score.controversy_risk}
                  negativeRisk={result.post_score.negative_signal_risk}
                />

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-term-border text-center">
          <p className="text-term-gray text-xs font-mono">
            X Algorithm Analysis powered by{' '}
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

function StatCell({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-sm font-mono font-bold text-term-green">{value}</div>
      <div className="text-[10px] text-term-gray uppercase font-mono">{label}</div>
    </div>
  );
}
