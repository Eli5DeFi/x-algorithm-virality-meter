"""
Pydantic schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class MediaType(str, Enum):
    NONE = "none"
    IMAGE = "image"
    VIDEO = "video"
    GIF = "gif"
    POLL = "poll"

class ContentType(str, Enum):
    SHORT = "short"
    THREAD = "thread"
    ARTICLE = "article"
    LONGFORM = "longform"
    QUOTE = "quote"

class ContentAnalysisRequest(BaseModel):
    """Request to analyze content for virality"""
    content: str = Field(..., min_length=1, max_length=4000, description="The post content to analyze")
    has_media: bool = Field(default=False, description="Whether the post has media")
    media_type: MediaType = Field(default=MediaType.NONE, description="Type of media attached")
    video_duration_ms: Optional[int] = Field(default=None, description="Video duration in milliseconds")

class SignalScore(BaseModel):
    """Individual signal score with explanation"""
    signal: str
    score: float
    weight: float
    impact: str  # "positive", "negative", "neutral"
    explanation: str

class ImprovementTip(BaseModel):
    """Suggestion to improve virality"""
    signal: str
    tip: str
    action: Optional[str] = None  # Specific action to take
    example: Optional[str] = None  # Concrete example
    impact: str  # e.g., "+12%"
    priority: str  # "high", "medium", "low"
    emoji: str


class DiversityFactor(BaseModel):
    """Individual diversity factor score"""
    score: float
    description: str


class DiversityScore(BaseModel):
    """Content diversity assessment"""
    diversity_score: int = Field(..., ge=0, le=100)
    diversity_tier: str  # "HIGHLY_DIVERSE", "WELL_BALANCED", "MODERATE", "LIMITED", "MONOTONE"
    tier_description: str
    factors: Dict[str, Any]

class ContentAnalysisResponse(BaseModel):
    """Response with virality analysis"""
    # Overall score and tier
    score: int = Field(..., ge=0, le=100)
    tier_level: int
    tier_name: str
    tier_emoji: str
    tier_description: str
    tier_color: str

    # Detailed breakdown
    signal_scores: List[SignalScore]

    # Aggregated scores by category
    engagement_potential: float  # 0-1
    shareability: float  # 0-1
    controversy_risk: float  # 0-1
    negative_signal_risk: float  # 0-1

    # Diversity score (from author_diversity_scorer.rs)
    diversity: Optional[DiversityScore] = None

    # Improvement suggestions
    improvements: List[ImprovementTip]

    # Content stats
    content_stats: Dict[str, Any]

class AccountSimulationRequest(BaseModel):
    """Request to simulate account virality potential"""
    followers_count: int = Field(..., ge=0)
    following_count: int = Field(..., ge=0)
    avg_likes: float = Field(default=0, ge=0)
    avg_replies: float = Field(default=0, ge=0)
    avg_retweets: float = Field(default=0, ge=0)
    posts_per_week: float = Field(default=7, ge=0)
    account_age_days: int = Field(default=365, ge=1)
    is_verified: bool = Field(default=False)
    niche: Optional[str] = Field(default=None)

class AccountSimulationResponse(BaseModel):
    """Response with account virality simulation"""
    account_tier: int
    account_tier_name: str
    account_tier_emoji: str
    overall_score: int

    # Metrics breakdown
    engagement_rate: float
    follower_quality_score: float
    consistency_score: float
    growth_potential: float

    # Recommendations
    recommendations: List[ImprovementTip]

    # Projections
    projected_reach_multiplier: float
    viral_post_probability: float

class CombinedAnalysisRequest(BaseModel):
    """Request to analyze content and account together"""
    # Content fields
    content: str = Field(..., min_length=1, max_length=4000, description="The post content to analyze")
    has_media: bool = Field(default=False, description="Whether the post has media")
    media_type: MediaType = Field(default=MediaType.NONE, description="Type of media attached")
    video_duration_ms: Optional[int] = Field(default=None, description="Video duration in milliseconds")
    content_type: ContentType = Field(default=ContentType.SHORT, description="Type of content")

    # Account fields
    followers_count: int = Field(..., ge=0)
    following_count: int = Field(..., ge=0)
    avg_likes: float = Field(default=0, ge=0)
    avg_replies: float = Field(default=0, ge=0)
    avg_retweets: float = Field(default=0, ge=0)
    posts_per_week: float = Field(default=7, ge=0)
    account_age_days: int = Field(default=365, ge=1)
    is_verified: bool = Field(default=False)
    niche: Optional[str] = Field(default=None)

class CombinedAnalysisResponse(BaseModel):
    """Response with combined analysis of account and post"""
    account_score: AccountSimulationResponse
    post_score: ContentAnalysisResponse
    aggregate_score: int = Field(..., ge=0, le=100)
    aggregate_tier_level: int
    aggregate_tier_name: str
    aggregate_tier_emoji: str
    aggregate_tier_description: str
    aggregate_tier_color: str
