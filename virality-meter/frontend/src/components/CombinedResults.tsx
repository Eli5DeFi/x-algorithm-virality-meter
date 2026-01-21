'use client';

import { motion } from 'framer-motion';
import { ContentAnalysisResponse, AccountSimulationResponse } from '@/lib/types';

interface CombinedResultsProps {
    accountResult: AccountSimulationResponse | null;
    postResult: ContentAnalysisResponse | null;
}

export default function CombinedResults({ accountResult, postResult }: CombinedResultsProps) {
    if (!accountResult || !postResult) {
        return null;
    }

    // Calculate combined metrics
    const adjustedReach = postResult.engagement_potential * accountResult.projected_reach_multiplier;
    const realViralProbability = (postResult.score / 100) * accountResult.viral_post_probability;

    // Estimate impressions based on engagement and reach
    const baseImpressions = postResult.score * 100; // Base calculation
    const accountMultiplier = accountResult.projected_reach_multiplier;
    const estimatedImpressions = Math.round(baseImpressions * accountMultiplier);

    // Determine boost/limit message
    const getBoostMessage = () => {
        if (accountMultiplier >= 3) {
            return { text: 'MASSIVE BOOST', color: 'text-term-green', icon: '🚀' };
        } else if (accountMultiplier >= 2) {
            return { text: 'STRONG BOOST', color: 'text-term-cyan', icon: '📈' };
        } else if (accountMultiplier >= 1.5) {
            return { text: 'MODERATE BOOST', color: 'text-term-amber', icon: '⬆️' };
        } else if (accountMultiplier >= 1) {
            return { text: 'SLIGHT BOOST', color: 'text-term-gray', icon: '→' };
        } else {
            return { text: 'LIMITED REACH', color: 'text-term-red', icon: '⬇️' };
        }
    };

    const boostInfo = getBoostMessage();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card"
        >
            <div className="terminal-card-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-term-gray ml-2">combined_projection.dat</span>
            </div>

            <div className="p-4 space-y-4">
                {/* Account + Post Overview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-term-bg border border-term-cyan p-3 text-center">
                        <div className="text-2xl mb-1">{accountResult.account_tier_emoji}</div>
                        <div className="text-lg font-mono font-bold text-term-cyan">
                            TIER_{accountResult.account_tier}
                        </div>
                        <div className="text-[10px] text-term-gray uppercase">Account</div>
                    </div>

                    <div className="bg-term-bg border border-term-green p-3 text-center">
                        <div className="text-2xl mb-1">{postResult.tier_emoji}</div>
                        <div className="text-lg font-mono font-bold text-term-green">
                            TIER_{postResult.tier_level}
                        </div>
                        <div className="text-[10px] text-term-gray uppercase">Post</div>
                    </div>
                </div>

                {/* Impact Banner */}
                <div className={`bg-term-bg-light border border-term-border p-3 text-center`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl">{boostInfo.icon}</span>
                        <span className={`text-sm font-mono font-bold ${boostInfo.color}`}>
                            {boostInfo.text}
                        </span>
                    </div>
                    <p className="text-xs text-term-gray font-mono">
                        Your TIER_{accountResult.account_tier} account gives this TIER_{postResult.tier_level} post up to{' '}
                        <span className="text-term-green font-bold">{accountMultiplier}x</span> reach multiplier
                    </p>
                </div>

                {/* Combined Metrics */}
                <div className="grid grid-cols-3 gap-2">
                    <MetricBox
                        label="Adjusted Reach"
                        value={`${Math.round(adjustedReach)}%`}
                        color="green"
                        tooltip="Post engagement × Account reach multiplier"
                    />
                    <MetricBox
                        label="Viral Probability"
                        value={`${Math.round(realViralProbability * 100)}%`}
                        color="cyan"
                        tooltip="Realistic chance of going viral based on both factors"
                    />
                    <MetricBox
                        label="Est. Impressions"
                        value={formatNumber(estimatedImpressions)}
                        color="amber"
                        tooltip="Estimated impressions based on account and post quality"
                    />
                </div>

                {/* Breakdown */}
                <div className="bg-term-bg border border-term-border p-3">
                    <div className="text-[10px] text-term-green mb-2 font-mono uppercase">Calculation Breakdown</div>
                    <div className="space-y-1.5 text-xs font-mono text-term-gray">
                        <div className="flex justify-between">
                            <span>Post Engagement Potential:</span>
                            <span className="text-gray-300">{postResult.engagement_potential}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Account Reach Multiplier:</span>
                            <span className="text-gray-300">{accountMultiplier}x</span>
                        </div>
                        <div className="flex justify-between border-t border-term-border pt-1.5">
                            <span className="text-term-green">Adjusted Reach:</span>
                            <span className="text-term-green font-bold">{Math.round(adjustedReach)}%</span>
                        </div>
                    </div>
                </div>

                {/* Key Insight */}
                <div className="bg-term-bg-light border-l-2 border-term-cyan p-3">
                    <div className="text-[10px] text-term-cyan mb-1 font-mono">💡 KEY INSIGHT</div>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed">
                        {getInsight(accountResult, postResult)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function MetricBox({
    label,
    value,
    color,
    tooltip,
}: {
    label: string;
    value: string;
    color: string;
    tooltip?: string;
}) {
    const colorMap: Record<string, string> = {
        green: 'text-term-green',
        cyan: 'text-term-cyan',
        amber: 'text-term-amber',
    };

    return (
        <div className="bg-term-bg border border-term-border p-2 text-center" title={tooltip}>
            <div className={`text-base font-mono font-bold ${colorMap[color]}`}>{value}</div>
            <div className="text-[9px] text-term-gray uppercase leading-tight mt-0.5">{label}</div>
        </div>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}

function getInsight(account: AccountSimulationResponse, post: ContentAnalysisResponse): string {
    const accountTier = account.account_tier;
    const postTier = post.tier_level;
    const multiplier = account.projected_reach_multiplier;

    if (accountTier >= 8 && postTier >= 8) {
        return 'Perfect storm! Elite account + viral content = massive reach potential. This could easily hit trending.';
    } else if (accountTier >= 6 && postTier >= 7) {
        return 'Strong combination! Your established account gives this quality content excellent visibility.';
    } else if (accountTier <= 3 && postTier >= 7) {
        return 'Great content, but limited by account reach. Focus on growing your audience to unlock full potential.';
    } else if (accountTier >= 7 && postTier <= 4) {
        return 'Your account has reach, but this content needs work. Review the improvement tips to boost performance.';
    } else if (multiplier < 1.5) {
        return 'Low reach multiplier detected. Improve engagement rate and posting consistency to grow your account tier.';
    } else {
        return 'Balanced metrics. Improve both account health and content quality for better viral potential.';
    }
}
