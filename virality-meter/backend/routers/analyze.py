"""
Content Analysis API Router
"""

from fastapi import APIRouter, HTTPException
from models.schemas import (
    ContentAnalysisRequest,
    ContentAnalysisResponse,
    SignalScore,
    ImprovementTip,
    DiversityScore,
    AccountSimulationRequest,
    AccountSimulationResponse,
    CombinedAnalysisRequest,
    CombinedAnalysisResponse,
)
from models.tiers import get_tier_for_score, get_all_tiers
from services.scorer import scorer

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=ContentAnalysisResponse)
async def analyze_content(request: ContentAnalysisRequest):
    """
    Analyze content for virality potential using X's algorithm signals.
    """
    try:
        # Extract features from content
        features = scorer.extract_features(
            content=request.content,
            has_media=request.has_media,
            media_type=request.media_type.value,
            video_duration_ms=request.video_duration_ms or 0,
        )

        # Calculate signal scores
        signals = scorer.calculate_signal_scores(features)

        # Calculate final score
        final_score, breakdown = scorer.calculate_final_score(signals)

        # Get tier
        tier = get_tier_for_score(final_score)

        # Generate improvements
        improvements = scorer.generate_improvements(features, signals)

        # Calculate diversity score
        diversity_data = scorer.calculate_diversity_score(features)
        diversity = DiversityScore(
            diversity_score=diversity_data["diversity_score"],
            diversity_tier=diversity_data["diversity_tier"],
            tier_description=diversity_data["tier_description"],
            factors=diversity_data["factors"],
        )

        # Build response
        signal_scores = [
            SignalScore(
                signal=name,
                score=round(data["score"], 3),
                weight=round(data["weight"], 3),
                impact=data["impact"],
                explanation=data["explanation"],
            )
            for name, data in signals.items()
        ]

        improvement_tips = [
            ImprovementTip(**tip) for tip in improvements
        ]

        return ContentAnalysisResponse(
            score=final_score,
            tier_level=tier.level,
            tier_name=tier.name,
            tier_emoji=tier.emoji,
            tier_description=tier.description,
            tier_color=tier.color,
            signal_scores=signal_scores,
            engagement_potential=round(breakdown["engagement_potential"], 3),
            shareability=round(breakdown["shareability"], 3),
            controversy_risk=round(breakdown["controversy_risk"], 3),
            negative_signal_risk=round(breakdown["negative_signal_risk"], 3),
            diversity=diversity,
            improvements=improvement_tips,
            content_stats={
                "char_count": features.char_count,
                "word_count": features.word_count,
                "hashtag_count": features.hashtag_count,
                "mention_count": features.mention_count,
                "has_question": features.has_question,
                "has_cta": features.has_cta,
                "emotional_tone": features.emotional_tone,
                "viral_hooks": features.viral_hook_count,
                "diversity_score": features.diversity_score,
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/account/simulate", response_model=AccountSimulationResponse)
async def simulate_account(request: AccountSimulationRequest):
    """
    Simulate account virality tier based on metrics.
    """
    try:
        # Calculate engagement rate
        total_engagement = request.avg_likes + request.avg_replies + request.avg_retweets
        engagement_rate = (total_engagement / max(request.followers_count, 1)) * 100

        # Follower quality score (ratio-based)
        if request.followers_count > 0:
            ratio = request.followers_count / max(request.following_count, 1)
            follower_quality = min(ratio / 5, 1.0)  # Cap at 5:1 ratio
        else:
            follower_quality = 0.1

        # Consistency score
        posts_per_day = request.posts_per_week / 7
        if 1 <= posts_per_day <= 5:
            consistency = 0.8 + (posts_per_day / 25)
        elif posts_per_day < 1:
            consistency = posts_per_day * 0.8
        else:
            consistency = max(0.5, 1.0 - (posts_per_day - 5) * 0.05)

        # Growth potential
        growth_potential = (
            follower_quality * 0.3 +
            min(engagement_rate / 5, 1.0) * 0.4 +
            consistency * 0.3
        )

        # Calculate overall score
        overall_score = int(
            (engagement_rate * 10) +  # Engagement is king
            (follower_quality * 20) +
            (consistency * 15) +
            (growth_potential * 15) +
            (15 if request.is_verified else 0) +
            min(request.account_age_days / 365, 1.0) * 10
        )
        overall_score = max(0, min(100, overall_score))

        # Get tier
        tier = get_tier_for_score(overall_score)

        # Generate recommendations
        recommendations = []

        if engagement_rate < 2:
            recommendations.append(ImprovementTip(
                signal="engagement",
                tip="Your engagement rate is low. Focus on creating conversation-starting content.",
                impact="+20-40%",
                priority="high",
                emoji="💬"
            ))

        if follower_quality < 0.5:
            recommendations.append(ImprovementTip(
                signal="followers",
                tip="Improve follower quality by engaging with your niche community, not follow-for-follow.",
                impact="+15-25%",
                priority="medium",
                emoji="🎯"
            ))

        if posts_per_day < 1:
            recommendations.append(ImprovementTip(
                signal="consistency",
                tip="Post at least once daily. Consistency signals to the algorithm you're active.",
                impact="+10-20%",
                priority="high",
                emoji="📅"
            ))
        elif posts_per_day > 10:
            recommendations.append(ImprovementTip(
                signal="consistency",
                tip="Posting too much can feel spammy. Quality over quantity.",
                impact="+5-10%",
                priority="medium",
                emoji="🎯"
            ))

        if not request.is_verified:
            recommendations.append(ImprovementTip(
                signal="verification",
                tip="Verified accounts get algorithm priority. Consider X Premium.",
                impact="+15-30%",
                priority="low",
                emoji="✓"
            ))

        # Viral probability
        viral_probability = min(
            (engagement_rate / 10) * 0.4 +
            follower_quality * 0.3 +
            (0.2 if request.is_verified else 0) +
            consistency * 0.1,
            0.95
        )

        return AccountSimulationResponse(
            account_tier=tier.level,
            account_tier_name=tier.name,
            account_tier_emoji=tier.emoji,
            overall_score=overall_score,
            engagement_rate=round(engagement_rate, 2),
            follower_quality_score=round(follower_quality, 3),
            consistency_score=round(consistency, 3),
            growth_potential=round(growth_potential, 3),
            recommendations=recommendations,
            projected_reach_multiplier=round(1 + (overall_score / 50), 2),
            viral_post_probability=round(viral_probability, 3),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze/combined", response_model=CombinedAnalysisResponse)
async def analyze_combined(request: CombinedAnalysisRequest):
    """
    Analyze both content and account together, calculating aggregate viral potential.

    The aggregate score uses X algorithm principles:
    - Account quality acts as a multiplier for content reach
    - Content quality determines engagement potential
    - Combined score reflects real-world virality likelihood
    """
    try:
        # 1. Analyze content
        content_request = ContentAnalysisRequest(
            content=request.content,
            has_media=request.has_media,
            media_type=request.media_type,
            video_duration_ms=request.video_duration_ms,
        )

        # Extract features from content with content type consideration
        features = scorer.extract_features(
            content=request.content,
            has_media=request.has_media,
            media_type=request.media_type.value,
            video_duration_ms=request.video_duration_ms or 0,
        )

        # Apply content type multipliers
        content_type_multipliers = {
            "short": 1.0,      # Standard tweets
            "thread": 1.15,    # Threads get more engagement
            "article": 1.05,   # Articles get quality readers
            "longform": 0.95,  # Long-form can be harder to engage with
            "quote": 1.1,      # Quote tweets benefit from original context
        }
        content_type_multiplier = content_type_multipliers.get(request.content_type.value, 1.0)

        # Calculate signal scores
        signals = scorer.calculate_signal_scores(features)

        # Calculate final content score with content type adjustment
        raw_post_score, breakdown = scorer.calculate_final_score(signals)
        adjusted_post_score = min(100, int(raw_post_score * content_type_multiplier))

        # Get tier for post
        post_tier = get_tier_for_score(adjusted_post_score)

        # Generate improvements
        improvements = scorer.generate_improvements(features, signals)

        # Build content response
        signal_scores = [
            SignalScore(
                signal=name,
                score=round(data["score"], 3),
                weight=round(data["weight"], 3),
                impact=data["impact"],
                explanation=data["explanation"],
            )
            for name, data in signals.items()
        ]

        improvement_tips = [ImprovementTip(**tip) for tip in improvements]

        # Calculate diversity score for combined analysis
        diversity_data = scorer.calculate_diversity_score(features)
        diversity = DiversityScore(
            diversity_score=diversity_data["diversity_score"],
            diversity_tier=diversity_data["diversity_tier"],
            tier_description=diversity_data["tier_description"],
            factors=diversity_data["factors"],
        )

        post_score = ContentAnalysisResponse(
            score=adjusted_post_score,
            tier_level=post_tier.level,
            tier_name=post_tier.name,
            tier_emoji=post_tier.emoji,
            tier_description=post_tier.description,
            tier_color=post_tier.color,
            signal_scores=signal_scores,
            engagement_potential=round(breakdown["engagement_potential"], 3),
            shareability=round(breakdown["shareability"], 3),
            controversy_risk=round(breakdown["controversy_risk"], 3),
            negative_signal_risk=round(breakdown["negative_signal_risk"], 3),
            diversity=diversity,
            improvements=improvement_tips,
            content_stats={
                "char_count": features.char_count,
                "word_count": features.word_count,
                "hashtag_count": features.hashtag_count,
                "mention_count": features.mention_count,
                "has_question": features.has_question,
                "has_cta": features.has_cta,
                "emotional_tone": features.emotional_tone,
                "viral_hooks": features.viral_hook_count,
                "diversity_score": features.diversity_score,
            },
        )

        # 2. Analyze account
        account_request = AccountSimulationRequest(
            followers_count=request.followers_count,
            following_count=request.following_count,
            avg_likes=request.avg_likes,
            avg_replies=request.avg_replies,
            avg_retweets=request.avg_retweets,
            posts_per_week=request.posts_per_week,
            account_age_days=request.account_age_days,
            is_verified=request.is_verified,
            niche=request.niche,
        )

        # Calculate engagement rate
        total_engagement = request.avg_likes + request.avg_replies + request.avg_retweets
        engagement_rate = (total_engagement / max(request.followers_count, 1)) * 100

        # Follower quality score
        if request.followers_count > 0:
            ratio = request.followers_count / max(request.following_count, 1)
            follower_quality = min(ratio / 5, 1.0)
        else:
            follower_quality = 0.1

        # Consistency score
        posts_per_day = request.posts_per_week / 7
        if 1 <= posts_per_day <= 5:
            consistency = 0.8 + (posts_per_day / 25)
        elif posts_per_day < 1:
            consistency = posts_per_day * 0.8
        else:
            consistency = max(0.5, 1.0 - (posts_per_day - 5) * 0.05)

        # Growth potential
        growth_potential = (
            follower_quality * 0.3 +
            min(engagement_rate / 5, 1.0) * 0.4 +
            consistency * 0.3
        )

        # Calculate overall account score
        account_score_value = int(
            (engagement_rate * 10) +
            (follower_quality * 20) +
            (consistency * 15) +
            (growth_potential * 15) +
            (15 if request.is_verified else 0) +
            min(request.account_age_days / 365, 1.0) * 10
        )
        account_score_value = max(0, min(100, account_score_value))

        # Get tier for account
        account_tier = get_tier_for_score(account_score_value)

        # Generate account recommendations
        recommendations = []

        if engagement_rate < 2:
            recommendations.append(ImprovementTip(
                signal="engagement",
                tip="Your engagement rate is low. Focus on creating conversation-starting content.",
                impact="+20-40%",
                priority="high",
                emoji="💬"
            ))

        if follower_quality < 0.5:
            recommendations.append(ImprovementTip(
                signal="followers",
                tip="Improve follower quality by engaging with your niche community, not follow-for-follow.",
                impact="+15-25%",
                priority="medium",
                emoji="🎯"
            ))

        if posts_per_day < 1:
            recommendations.append(ImprovementTip(
                signal="consistency",
                tip="Post at least once daily. Consistency signals to the algorithm you're active.",
                impact="+10-20%",
                priority="high",
                emoji="📅"
            ))
        elif posts_per_day > 10:
            recommendations.append(ImprovementTip(
                signal="consistency",
                tip="Posting too much can feel spammy. Quality over quantity.",
                impact="+5-10%",
                priority="medium",
                emoji="🎯"
            ))

        if not request.is_verified:
            recommendations.append(ImprovementTip(
                signal="verification",
                tip="Verified accounts get algorithm priority. Consider X Premium.",
                impact="+15-30%",
                priority="low",
                emoji="✓"
            ))

        # Viral probability
        viral_probability = min(
            (engagement_rate / 10) * 0.4 +
            follower_quality * 0.3 +
            (0.2 if request.is_verified else 0) +
            consistency * 0.1,
            0.95
        )

        account_score = AccountSimulationResponse(
            account_tier=account_tier.level,
            account_tier_name=account_tier.name,
            account_tier_emoji=account_tier.emoji,
            overall_score=account_score_value,
            engagement_rate=round(engagement_rate, 2),
            follower_quality_score=round(follower_quality, 3),
            consistency_score=round(consistency, 3),
            growth_potential=round(growth_potential, 3),
            recommendations=recommendations,
            projected_reach_multiplier=round(1 + (account_score_value / 50), 2),
            viral_post_probability=round(viral_probability, 3),
        )

        # 3. Calculate aggregate score using X algorithm principles
        # Account quality acts as a multiplier for content distribution
        # Formula: (post_quality * 0.6) + (account_quality * 0.4) + (account_multiplier_effect)

        # Normalize scores to 0-1
        post_normalized = adjusted_post_score / 100
        account_normalized = account_score_value / 100

        # Account multiplier effect (accounts with higher quality get more reach)
        reach_multiplier = 1 + (account_normalized * 0.5)  # Up to 1.5x multiplier

        # Calculate aggregate with weighted formula
        base_aggregate = (post_normalized * 0.6 + account_normalized * 0.4) * 100

        # Apply reach multiplier to post component
        amplified_aggregate = (post_normalized * reach_multiplier * 0.6 + account_normalized * 0.4) * 100

        # Final aggregate (blend of base and amplified)
        aggregate_score = int((base_aggregate * 0.4 + amplified_aggregate * 0.6))
        aggregate_score = max(0, min(100, aggregate_score))

        # Get tier for aggregate
        aggregate_tier = get_tier_for_score(aggregate_score)

        return CombinedAnalysisResponse(
            account_score=account_score,
            post_score=post_score,
            aggregate_score=aggregate_score,
            aggregate_tier_level=aggregate_tier.level,
            aggregate_tier_name=aggregate_tier.name,
            aggregate_tier_emoji=aggregate_tier.emoji,
            aggregate_tier_description=aggregate_tier.description,
            aggregate_tier_color=aggregate_tier.color,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tiers")
async def get_tiers():
    """Get all virality tier definitions"""
    return {"tiers": get_all_tiers()}
