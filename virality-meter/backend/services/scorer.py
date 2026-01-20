"""
X Algorithm Virality Scorer

Based on the actual X recommendation algorithm from:
- home-mixer/scorers/phoenix_scorer.rs (engagement predictions)
- home-mixer/scorers/weighted_scorer.rs (weight combinations)
- home-mixer/scorers/author_diversity_scorer.rs (diversity factors)

This service analyzes content and predicts virality based on algorithm signals.
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple
import re
import math

# =============================================================================
# ALGORITHM WEIGHTS (Derived from X's weighted_scorer.rs)
# =============================================================================

# Positive engagement weights (normalized to sum to ~1.0 for positive signals)
ENGAGEMENT_WEIGHTS = {
    # High-value engagements
    "favorite": 0.15,           # Likes - strong signal
    "reply": 0.18,              # Replies - very strong (conversation driver)
    "retweet": 0.16,            # Retweets - high reach multiplier
    "quote": 0.12,              # Quote tweets - engagement + reach
    "follow_author": 0.10,      # New follows - high value

    # Medium-value engagements
    "click": 0.06,              # Tweet clicks
    "profile_click": 0.05,      # Profile visits
    "photo_expand": 0.04,       # Image clicks
    "video_quality_view": 0.05, # Video watches (conditional)
    "dwell_time": 0.04,         # Read time

    # Lower-value engagements
    "share": 0.03,              # General shares
    "share_dm": 0.01,           # DM shares
    "share_copy_link": 0.01,    # Link copies
}

# Negative signal weights (these reduce score)
NEGATIVE_WEIGHTS = {
    "not_interested": -0.15,
    "block_author": -0.25,
    "mute_author": -0.20,
    "report": -0.30,
}

# Content feature impact weights
CONTENT_WEIGHTS = {
    "optimal_length": 0.08,
    "has_media": 0.12,
    "has_video": 0.10,
    "has_question": 0.10,
    "has_cta": 0.08,
    "emotional_content": 0.07,
    "trending_topic": 0.15,
    "hashtag_optimal": 0.05,
    "mention_engagement": 0.05,
}

# =============================================================================
# CONTENT ANALYSIS PATTERNS
# =============================================================================

# Engagement-driving patterns
QUESTION_PATTERNS = [
    r'\?$', r'\?["\']', r'what do you think', r'thoughts\?', r'agree\?',
    r'who else', r'anyone else', r'how do you', r'why do', r'which one',
]

CTA_PATTERNS = [
    r'retweet', r'rt if', r'like if', r'share', r'follow', r'comment',
    r'drop a', r'tell me', r'let me know', r'reply with', r'quote tweet',
    r'thread', r'bookmark this', r'save this',
]

EMOTIONAL_PATTERNS = {
    "positive": [r'amazing', r'incredible', r'love', r'best', r'awesome', r'great', r'excited', r'happy', r'blessed'],
    "negative": [r'terrible', r'worst', r'hate', r'angry', r'frustrated', r'disappointed', r'sad', r'crying'],
    "controversial": [r'unpopular opinion', r'hot take', r'controversial', r'fight me', r'don\'t @ me', r'ratio'],
    "urgent": [r'breaking', r'just in', r'urgent', r'happening now', r'live'],
}

VIRAL_HOOKS = [
    r'thread', r'a thread', r'1/', r'\d+\)', r'here\'s why',
    r'nobody talks about', r'the truth about', r'i was today years old',
    r'pov:', r'me:', r'normalize', r'we need to talk about',
    r'hot take', r'unpopular opinion', r'ratio', r'this',
]

# Trending/high-engagement topics (Dynamic simulation)
TRENDING_TOPICS = [
    'ai', 'chatgpt', 'grok', 'crypto', 'bitcoin', 'elon', 'tesla',
    'apple', 'iphone', 'tech', 'startup', 'breaking', 'just announced',
    'web3', 'solana', 'eth', 'nft', 'meme', 'doge', 'pepe', 'degens',
    'algorithm', 'openai', 'anthropic', 'nvidia', 'h100', 'gpu',
    'federal reserve', 'inflation', 'economy', 'market', 'bullish',
]

# Shadowban/Deboost signals (Muted words or toxic patterns)
DEBOOST_PATTERNS = [
    r'follow for follow', r'f4f', r'sub4sub', r'click the link', r'buy now',
    r'limited time', r'dm for collab', r'make money fast', r'scam', r'fraud',
    r'giveaway' # Giveaway is often deboosted unless verified
]


@dataclass
class ContentFeatures:
    """Extracted features from content"""
    char_count: int
    word_count: int
    hashtag_count: int
    mention_count: int
    url_count: int
    emoji_count: int
    has_question: bool
    has_cta: bool
    has_media: bool
    media_type: str
    video_duration_ms: int
    emotional_tone: str
    emotional_intensity: float
    controversy_score: float
    trending_alignment: float
    viral_hook_count: int
    line_count: int
    caps_ratio: float
    content: str


class ViralityScorer:
    """
    Scores content for viral potential based on X's algorithm signals.
    """

    def __init__(self):
        self.engagement_weights = ENGAGEMENT_WEIGHTS
        self.negative_weights = NEGATIVE_WEIGHTS
        self.content_weights = CONTENT_WEIGHTS

    def extract_features(self, content: str, has_media: bool = False,
                         media_type: str = "none", video_duration_ms: int = 0) -> ContentFeatures:
        """Extract all relevant features from content"""

        content_lower = content.lower()

        # Basic counts
        char_count = len(content)
        word_count = len(content.split())
        hashtag_count = len(re.findall(r'#\w+', content))
        mention_count = len(re.findall(r'@\w+', content))
        url_count = len(re.findall(r'https?://\S+', content))
        emoji_count = len(re.findall(r'[\U0001F300-\U0001F9FF]', content))
        line_count = len(content.split('\n'))

        # Caps ratio (shouting detection)
        alpha_chars = re.findall(r'[a-zA-Z]', content)
        caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / max(len(alpha_chars), 1)

        # Question detection
        has_question = any(re.search(p, content_lower) for p in QUESTION_PATTERNS)

        # CTA detection
        has_cta = any(re.search(p, content_lower) for p in CTA_PATTERNS)

        # Emotional analysis
        emotional_tone, emotional_intensity = self._analyze_emotion(content_lower)

        # Controversy score
        controversy_score = self._calculate_controversy(content_lower)

        # Trending alignment
        trending_alignment = self._calculate_trending_alignment(content_lower)

        # Viral hooks
        viral_hook_count = sum(1 for p in VIRAL_HOOKS if re.search(p, content_lower))

        return ContentFeatures(
            char_count=char_count,
            word_count=word_count,
            hashtag_count=hashtag_count,
            mention_count=mention_count,
            url_count=url_count,
            emoji_count=emoji_count,
            has_question=has_question,
            has_cta=has_cta,
            has_media=has_media,
            media_type=media_type,
            video_duration_ms=video_duration_ms,
            emotional_tone=emotional_tone,
            emotional_intensity=emotional_intensity,
            controversy_score=controversy_score,
            trending_alignment=trending_alignment,
            viral_hook_count=viral_hook_count,
            line_count=line_count,
            caps_ratio=caps_ratio,
            content=content,
        )

    def _analyze_deboost_risk(self, content: str) -> float:
        """Calculate deboost/shadowban risk probability"""
        matches = sum(1 for p in DEBOOST_PATTERNS if re.search(p, content))
        return min(matches / 3, 1.0)

    def _analyze_emotion(self, content: str) -> Tuple[str, float]:
        """Analyze emotional content"""
        scores = {}
        for emotion, patterns in EMOTIONAL_PATTERNS.items():
            matches = sum(1 for p in patterns if re.search(p, content))
            scores[emotion] = matches

        max_emotion = max(scores, key=scores.get) if any(scores.values()) else "neutral"
        intensity = min(scores.get(max_emotion, 0) / 3, 1.0)

        return max_emotion, intensity

    def _calculate_controversy(self, content: str) -> float:
        """Calculate controversy potential (drives replies/quotes)"""
        controversy_signals = [
            r'unpopular opinion', r'hot take', r'controversial', r'fight me',
            r'ratio', r'L take', r'W take', r'wrong', r'actually',
            r'disagree', r'overrated', r'underrated', r'mid',
        ]
        matches = sum(1 for p in controversy_signals if re.search(p, content))
        return min(matches / 4, 1.0)

    def _calculate_trending_alignment(self, content: str) -> float:
        """Check alignment with trending topics"""
        matches = sum(1 for topic in TRENDING_TOPICS if topic in content)
        return min(matches / 3, 1.0)

    def calculate_signal_scores(self, features: ContentFeatures) -> Dict[str, Dict]:
        """
        Calculate predicted engagement signals based on content features.
        Returns probability estimates for each engagement type.
        """
        signals = {}

        # Base scores from content quality
        base_quality = self._calculate_base_quality(features)

        # Favorite (Like) prediction
        favorite_score = base_quality * 0.7
        if features.has_media:
            favorite_score += 0.15
        if features.emotional_intensity > 0.5:
            favorite_score += 0.10
        signals["favorite"] = {
            "score": min(favorite_score, 1.0),
            "weight": self.engagement_weights["favorite"],
            "impact": "positive",
            "explanation": "Likes driven by emotional resonance and visual content"
        }

        # Reply prediction (controversy + questions drive replies)
        reply_score = base_quality * 0.5
        if features.has_question:
            reply_score += 0.25
        if features.controversy_score > 0.3:
            reply_score += 0.20
        signals["reply"] = {
            "score": min(reply_score, 1.0),
            "weight": self.engagement_weights["reply"],
            "impact": "positive",
            "explanation": "Questions and controversial takes drive conversations"
        }

        # Retweet prediction (shareability + value)
        retweet_score = base_quality * 0.5
        if features.viral_hook_count > 0:
            retweet_score += 0.20
        if features.trending_alignment > 0.3:
            retweet_score += 0.15
        if features.has_cta:
            retweet_score += 0.10
        signals["retweet"] = {
            "score": min(retweet_score, 1.0),
            "weight": self.engagement_weights["retweet"],
            "impact": "positive",
            "explanation": "Viral hooks and trending topics increase shareability"
        }

        # Quote tweet prediction
        quote_score = base_quality * 0.4
        if features.controversy_score > 0.5:
            quote_score += 0.25
        if features.emotional_tone == "controversial":
            quote_score += 0.15
        signals["quote"] = {
            "score": min(quote_score, 1.0),
            "weight": self.engagement_weights["quote"],
            "impact": "positive",
            "explanation": "Controversial content gets quote tweeted more"
        }

        # Follow author prediction
        follow_score = base_quality * 0.3
        if features.viral_hook_count >= 2:
            follow_score += 0.15
        signals["follow_author"] = {
            "score": min(follow_score, 1.0),
            "weight": self.engagement_weights["follow_author"],
            "impact": "positive",
            "explanation": "High-quality viral content attracts new followers"
        }

        # Click prediction
        click_score = base_quality * 0.6
        if features.line_count > 3:  # Thread/longer content
            click_score += 0.15
        signals["click"] = {
            "score": min(click_score, 1.0),
            "weight": self.engagement_weights["click"],
            "impact": "positive",
            "explanation": "Longer content and threads drive click engagement"
        }

        # Profile click prediction
        profile_score = base_quality * 0.4
        if features.controversy_score > 0.3:
            profile_score += 0.10
        signals["profile_click"] = {
            "score": min(profile_score, 1.0),
            "weight": self.engagement_weights["profile_click"],
            "impact": "positive",
            "explanation": "Interesting content makes people check your profile"
        }

        # Photo expand prediction
        photo_score = 0.1
        if features.has_media and features.media_type == "image":
            photo_score = base_quality * 0.7 + 0.2
        signals["photo_expand"] = {
            "score": min(photo_score, 1.0),
            "weight": self.engagement_weights["photo_expand"],
            "impact": "positive",
            "explanation": "Images dramatically increase engagement"
        }

        # Video quality view prediction
        vqv_score = 0.1
        if features.has_media and features.media_type == "video":
            vqv_score = base_quality * 0.6 + 0.2
            # Optimal video duration: 30s - 2min based on algorithm
            if features.video_duration_ms:
                if 30000 <= features.video_duration_ms <= 120000:
                    vqv_score += 0.15
        signals["video_quality_view"] = {
            "score": min(vqv_score, 1.0),
            "weight": self.engagement_weights["video_quality_view"],
            "impact": "positive",
            "explanation": "Videos 30s-2min have highest completion rates"
        }

        # Dwell time prediction
        dwell_score = base_quality * 0.5
        if features.char_count > 200:
            dwell_score += 0.15
        if features.line_count > 2:
            dwell_score += 0.10
        signals["dwell_time"] = {
            "score": min(dwell_score, 1.0),
            "weight": self.engagement_weights["dwell_time"],
            "impact": "positive",
            "explanation": "Longer, well-structured content keeps attention"
        }

        # Share predictions
        share_base = base_quality * 0.4
        signals["share"] = {
            "score": min(share_base + 0.1, 1.0),
            "weight": self.engagement_weights["share"],
            "impact": "positive",
            "explanation": "Share-worthy content has clear value"
        }
        signals["share_dm"] = {
            "score": min(share_base * 0.8, 1.0),
            "weight": self.engagement_weights["share_dm"],
            "impact": "positive",
            "explanation": "Personal/relatable content gets DM'd"
        }
        signals["share_copy_link"] = {
            "score": min(share_base * 0.7, 1.0),
            "weight": self.engagement_weights["share_copy_link"],
            "impact": "positive",
            "explanation": "Reference-worthy content gets saved/shared"
        }

        # Negative signal predictions
        negative_base = 0.05  # Base risk

        # Not interested risk
        not_interested = negative_base
        if features.caps_ratio > 0.5:  # SHOUTING
            not_interested += 0.15
        if features.hashtag_count > 5:  # Hashtag spam
            not_interested += 0.20
        signals["not_interested"] = {
            "score": min(not_interested, 1.0),
            "weight": self.negative_weights["not_interested"],
            "impact": "negative",
            "explanation": "Spammy signals make people hide your content"
        }

        # Block/mute/report risk (usually from extreme content)
        extreme_risk = negative_base
        if features.caps_ratio > 0.7:
            extreme_risk += 0.10
        signals["block_author"] = {
            "score": min(extreme_risk, 1.0),
            "weight": self.negative_weights["block_author"],
            "impact": "negative",
            "explanation": "Aggressive content leads to blocks"
        }
        signals["mute_author"] = {
            "score": min(extreme_risk + 0.05, 1.0),
            "weight": self.negative_weights["mute_author"],
            "impact": "negative",
            "explanation": "Annoying patterns lead to mutes"
        }
        signals["report"] = {
            "score": min(extreme_risk * 0.5, 1.0),
            "weight": self.negative_weights["report"],
            "impact": "negative",
            "explanation": "Policy violations lead to reports"
        }

        # Deboost/Shadowban risk
        deboost_risk = self._analyze_deboost_risk(getattr(features, 'content', ''))
        signals["deboost"] = {
            "score": deboost_risk,
            "weight": -0.10,
            "impact": "negative",
            "explanation": "Spammy or engagement-farming keywords can deboost reach"
        }

        return signals

    def _calculate_base_quality(self, features: ContentFeatures) -> float:
        """Calculate base content quality score"""
        score = 0.3  # Base

        # Optimal length (100-280 chars is sweet spot)
        if 100 <= features.char_count <= 280:
            score += 0.15
        elif 50 <= features.char_count <= 400:
            score += 0.08

        # Media boost
        if features.has_media:
            score += 0.15

        # Hashtag sweet spot (1-2)
        if 1 <= features.hashtag_count <= 2:
            score += 0.05
        elif features.hashtag_count > 5:
            score -= 0.10

        # Mention engagement
        if 1 <= features.mention_count <= 3:
            score += 0.05

        # Emoji usage (moderate is good)
        if 1 <= features.emoji_count <= 4:
            score += 0.05

        # Viral hooks
        score += features.viral_hook_count * 0.08

        return min(max(score, 0.1), 0.9)

    def calculate_final_score(self, signals: Dict[str, Dict]) -> Tuple[int, Dict]:
        """
        Calculate final virality score (0-100) using weighted combination.
        Mimics weighted_scorer.rs logic.
        """
        positive_sum = 0.0
        negative_sum = 0.0
        weights_sum = 0.0

        for signal_name, signal_data in signals.items():
            score = signal_data["score"]
            weight = signal_data["weight"]

            if weight > 0:
                positive_sum += score * weight
                weights_sum += weight
            else:
                negative_sum += score * abs(weight)

        # Normalize and combine (based on weighted_scorer.rs normalization)
        if weights_sum > 0:
            positive_normalized = positive_sum / weights_sum
        else:
            positive_normalized = 0

        # Apply negative penalty
        final = positive_normalized - (negative_sum * 0.5)

        # Scale to 0-100
        final_score = int(max(0, min(100, final * 100)))

        breakdown = {
            "engagement_potential": positive_normalized,
            "shareability": signals.get("retweet", {}).get("score", 0) * 0.5 +
                           signals.get("quote", {}).get("score", 0) * 0.3 +
                           signals.get("share", {}).get("score", 0) * 0.2,
            "controversy_risk": signals.get("quote", {}).get("score", 0) * 0.5 +
                               (signals.get("reply", {}).get("score", 0) - 0.3) * 0.5,
            "negative_signal_risk": negative_sum,
        }

        return final_score, breakdown

    def generate_improvements(self, features: ContentFeatures,
                             signals: Dict[str, Dict]) -> List[Dict]:
        """Generate actionable improvement tips"""
        tips = []

        # Check for missing question
        if not features.has_question and signals["reply"]["score"] < 0.6:
            tips.append({
                "signal": "reply",
                "tip": "Add a question to spark conversation",
                "impact": "+15-20%",
                "priority": "high",
                "emoji": "❓"
            })

        # Check for missing media
        if not features.has_media:
            tips.append({
                "signal": "favorite",
                "tip": "Add an image or video - visual content gets 2x engagement",
                "impact": "+25-40%",
                "priority": "high",
                "emoji": "🖼️"
            })

        # Check for missing viral hook
        if features.viral_hook_count == 0:
            tips.append({
                "signal": "retweet",
                "tip": "Start with a hook: 'Thread:', 'Hot take:', or 'Nobody talks about...'",
                "impact": "+10-15%",
                "priority": "medium",
                "emoji": "🪝"
            })

        # Check for suboptimal length
        if features.char_count < 80:
            tips.append({
                "signal": "dwell_time",
                "tip": "Add more context - posts under 80 chars feel incomplete",
                "impact": "+8-12%",
                "priority": "medium",
                "emoji": "📝"
            })
        elif features.char_count > 400:
            tips.append({
                "signal": "favorite",
                "tip": "Consider splitting into a thread - walls of text get skipped",
                "impact": "+10-15%",
                "priority": "medium",
                "emoji": "🧵"
            })

        # Check hashtag usage
        if features.hashtag_count > 3:
            tips.append({
                "signal": "not_interested",
                "tip": "Reduce hashtags to 1-2 max - more looks spammy",
                "impact": "-15% risk",
                "priority": "high",
                "emoji": "🚫"
            })
        elif features.hashtag_count == 0 and features.trending_alignment < 0.3:
            tips.append({
                "signal": "retweet",
                "tip": "Add 1-2 relevant trending hashtags for discovery",
                "impact": "+5-10%",
                "priority": "low",
                "emoji": "#️⃣"
            })

        # Check for CTA
        if not features.has_cta and signals["retweet"]["score"] < 0.5:
            tips.append({
                "signal": "retweet",
                "tip": "Add a soft CTA: 'RT if you agree' or 'Drop your thoughts below'",
                "impact": "+8-12%",
                "priority": "medium",
                "emoji": "📣"
            })

        # Check for caps abuse
        if features.caps_ratio > 0.3:
            tips.append({
                "signal": "not_interested",
                "tip": "Ease up on the caps lock - it reads as shouting",
                "impact": "-10% risk",
                "priority": "high",
                "emoji": "🔇"
            })

        # Check emotional content
        if features.emotional_intensity < 0.2:
            tips.append({
                "signal": "favorite",
                "tip": "Add emotional punch - strong opinions get reactions",
                "impact": "+10-15%",
                "priority": "medium",
                "emoji": "💥"
            })

        # Check for controversy (can be positive)
        if features.controversy_score < 0.2 and signals["quote"]["score"] < 0.4:
            tips.append({
                "signal": "quote",
                "tip": "Spicier takes get quote tweeted - don't be afraid to be bold",
                "impact": "+15-25%",
                "priority": "low",
                "emoji": "🌶️"
            })

        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        tips.sort(key=lambda x: priority_order.get(x["priority"], 2))

        return tips[:5]  # Return top 5 tips


# Singleton instance
scorer = ViralityScorer()
