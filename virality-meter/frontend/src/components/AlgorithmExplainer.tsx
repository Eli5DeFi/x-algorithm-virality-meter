'use client';

import { motion } from 'framer-motion';

export default function AlgorithmExplainer() {
  return (
    <div className="terminal-card border-2 border-term-cyan/30">
      <div className="terminal-card-header bg-term-cyan/10">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-term-cyan ml-2 font-bold">X_ALGORITHM_EXPLAINED.md</span>
      </div>
      <div className="p-4 space-y-4 text-xs font-mono max-h-[600px] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-term-border pb-3">
          <h2 className="text-sm text-term-green font-bold mb-2">
            How X's Recommendation Algorithm Works
          </h2>
          <p className="text-gray-400 leading-relaxed">
            X's algorithm determines what content appears in your "For You" timeline. Understanding how it works
            helps you create content that gets maximum distribution.
          </p>
        </div>

        {/* Three-Stage Pipeline */}
        <div className="space-y-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§1.</span> Three-Stage Pipeline
          </h3>
          <div className="pl-4 space-y-2 text-gray-300 leading-relaxed">
            <div>
              <span className="text-term-cyan font-bold">Stage 1: Candidate Retrieval</span>
              <p className="text-gray-400 mt-1">
                The algorithm fetches ~1,500 candidate tweets from three sources:
              </p>
              <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-gray-400">
                <li><span className="text-term-green">In-Network</span> - Tweets from people you follow</li>
                <li><span className="text-term-green">Out-of-Network</span> - Tweets from people you don't follow but might interest you</li>
                <li><span className="text-term-green">Embeddings</span> - Similar tweets based on your engagement history</li>
              </ul>
            </div>

            <div>
              <span className="text-term-cyan font-bold">Stage 2: Ranking (Phoenix Scorer)</span>
              <p className="text-gray-400 mt-1">
                Each tweet gets a <span className="text-term-amber">relevance score</span> predicting your likelihood to engage.
                The algorithm uses a neural network trained on <span className="text-term-green font-bold">billions of interactions</span>.
              </p>
            </div>

            <div>
              <span className="text-term-cyan font-bold">Stage 3: Filtering & Mixing</span>
              <p className="text-gray-400 mt-1">
                Final stage applies filters (blocks, mutes), balances content diversity, and mixes in ads.
              </p>
            </div>
          </div>
        </div>

        {/* Engagement Signals */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§2.</span> Engagement Signal Weights
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Not all engagements are equal. The algorithm assigns different weights based on action value:
          </p>

          <div className="space-y-2">
            <div className="bg-term-bg-light border border-term-green/30 p-2">
              <div className="text-term-green font-bold mb-1">HIGH VALUE SIGNALS</div>
              <ul className="space-y-1 text-gray-300 text-[11px]">
                <li><span className="text-term-cyan">→</span> <span className="text-term-green font-bold">Reply (0.18)</span> - Shows deep engagement, starts conversations</li>
                <li><span className="text-term-cyan">→</span> <span className="text-term-green font-bold">Retweet (0.16)</span> - Amplifies reach, strong endorsement</li>
                <li><span className="text-term-cyan">→</span> <span className="text-term-green font-bold">Like (0.15)</span> - Most common positive signal</li>
                <li><span className="text-term-cyan">→</span> <span className="text-term-green font-bold">Quote Tweet (0.12)</span> - Adds commentary, high value</li>
                <li><span className="text-term-cyan">→</span> <span className="text-term-green font-bold">Follow Author (0.10)</span> - Strongest signal of quality content</li>
              </ul>
            </div>

            <div className="bg-term-bg-light border border-term-amber/30 p-2">
              <div className="text-term-amber font-bold mb-1">MEDIUM VALUE SIGNALS</div>
              <ul className="space-y-1 text-gray-300 text-[11px]">
                <li><span className="text-term-cyan">→</span> Click (0.06), Profile Click (0.05), Video View (0.05)</li>
                <li><span className="text-term-cyan">→</span> Dwell Time (0.04), Photo Expand (0.04)</li>
              </ul>
            </div>

            <div className="bg-term-bg-light border border-term-red/30 p-2">
              <div className="text-term-red font-bold mb-1">NEGATIVE SIGNALS (PENALTIES)</div>
              <ul className="space-y-1 text-gray-300 text-[11px]">
                <li><span className="text-term-red">×</span> <span className="text-term-red font-bold">Report (-0.30)</span> - Severe penalty, can lead to shadowban</li>
                <li><span className="text-term-red">×</span> <span className="text-term-red font-bold">Block Author (-0.25)</span> - Strong negative signal</li>
                <li><span className="text-term-red">×</span> <span className="text-term-red font-bold">Mute Author (-0.20)</span> - Reduces future distribution</li>
                <li><span className="text-term-red">×</span> <span className="text-term-red font-bold">Not Interested (-0.15)</span> - Tells algorithm to show less</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Author Diversity & Quality */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§3.</span> Author Diversity & Quality Ranking
          </h3>
          <div className="space-y-2 text-gray-300 leading-relaxed">
            <p className="text-gray-400">
              The algorithm favors <span className="text-term-cyan font-bold">content diversity</span> to prevent timeline monotony.
            </p>
            <div className="bg-term-bg-light border border-term-cyan/30 p-2 space-y-1 text-[11px]">
              <div><span className="text-term-green">✓</span> Varied content types (text, media, polls, links)</div>
              <div><span className="text-term-green">✓</span> Mix of emotional tones (not all controversy, not all neutral)</div>
              <div><span className="text-term-green">✓</span> Different engagement mechanisms (questions, CTAs, statements)</div>
              <div><span className="text-term-green">✓</span> Balanced posting frequency (1-5 posts/day optimal)</div>
              <div><span className="text-term-red">×</span> Spammy behavior (excessive hashtags, caps, mentions)</div>
            </div>
          </div>
        </div>

        {/* Blue Verified Boost */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§4.</span> Blue Verified Priority Ranking
          </h3>
          <p className="text-gray-300 leading-relaxed">
            <span className="text-term-cyan font-bold">X Premium (Blue)</span> subscribers get explicit algorithmic boosts:
          </p>
          <div className="bg-term-bg-light border border-term-cyan/30 p-2 space-y-1 text-[11px]">
            <div><span className="text-term-green">↑</span> <span className="text-term-cyan font-bold">+15 score boost</span> in ranking algorithm</div>
            <div><span className="text-term-green">↑</span> Priority in replies (appear higher in threads)</div>
            <div><span className="text-term-green">↑</span> Increased reach multiplier for viral content</div>
            <div><span className="text-term-green">↑</span> Better placement in "For You" recommendations</div>
          </div>
        </div>

        {/* Content Features That Matter */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§5.</span> Content Features That Boost Distribution
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-term-bg-light border border-term-green/30 p-2">
              <div className="text-term-green font-bold mb-1">CONTENT STRUCTURE</div>
              <div className="space-y-1 text-gray-300">
                <div>• Optimal length: 50-280 chars</div>
                <div>• Has media (images/video)</div>
                <div>• 1-3 hashtags (not more)</div>
                <div>• Line breaks for readability</div>
              </div>
            </div>

            <div className="bg-term-bg-light border border-term-amber/30 p-2">
              <div className="text-term-amber font-bold mb-1">ENGAGEMENT TRIGGERS</div>
              <div className="space-y-1 text-gray-300">
                <div>• Asks questions</div>
                <div>• Has clear CTA</div>
                <div>• Trending topics/keywords</div>
                <div>• Viral hooks (threads, POV, etc)</div>
              </div>
            </div>
          </div>
        </div>

        {/* What Hurts Your Reach */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§6.</span> What Hurts Your Reach (Deboost Patterns)
          </h3>
          <div className="bg-term-bg-light border border-term-red/30 p-2">
            <ul className="space-y-1 text-gray-300 text-[11px]">
              <li><span className="text-term-red">×</span> Engagement bait ("Like if...", "RT for...")</li>
              <li><span className="text-term-red">×</span> Follow-for-follow requests</li>
              <li><span className="text-term-red">×</span> Excessive hashtags (&gt;5)</li>
              <li><span className="text-term-red">×</span> ALL CAPS SHOUTING</li>
              <li><span className="text-term-red">×</span> Spammy links or scam keywords</li>
              <li><span className="text-term-red">×</span> Low-quality or misleading content</li>
            </ul>
          </div>
        </div>

        {/* Timing & Consistency */}
        <div className="space-y-3 border-t border-term-border pt-3">
          <h3 className="text-term-amber font-bold">
            <span className="text-term-green">§7.</span> Posting Frequency & Consistency
          </h3>
          <p className="text-gray-300 leading-relaxed">
            The algorithm rewards <span className="text-term-cyan font-bold">consistent, quality posting</span> over sporadic activity:
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-term-green font-bold">OPTIMAL:</span>
              <span className="text-gray-300">1-5 tweets per day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-term-amber font-bold">ACCEPTABLE:</span>
              <span className="text-gray-300">5-10 tweets per day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-term-red font-bold">SPAM RISK:</span>
              <span className="text-gray-300">&gt;10 tweets per day</span>
            </div>
          </div>
        </div>

        {/* Footer Source */}
        <div className="border-t border-term-border pt-3 text-[11px]">
          <p className="text-gray-400">
            <span className="text-term-cyan">Source:</span> Based on{' '}
            <a
              href="https://github.com/xai-org/x-algorithm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-green hover:underline font-bold"
            >
              xai-org/x-algorithm
            </a>
            {' '}— Open-source implementation of X's recommendation algorithm
          </p>
          <p className="text-gray-500 mt-2 italic">
            Note: This explains the base algorithm. Production may include additional ranking factors.
          </p>
        </div>
      </div>
    </div>
  );
}
