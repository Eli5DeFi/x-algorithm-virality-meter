"""
X Algorithm Virality Tiers - 10 Humorous Classifications
Based on the scoring system from the x-algorithm codebase
"""

from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class ViralityTier:
    level: int
    name: str
    emoji: str
    description: str
    min_score: int
    max_score: int
    color: str  # Tailwind color class

VIRALITY_TIERS: List[ViralityTier] = [
    ViralityTier(
        level=1,
        name="Digital Tombstone",
        emoji="🪦",
        description="Your post is legally dead. RIP engagement.",
        min_score=0,
        max_score=10,
        color="gray"
    ),
    ViralityTier(
        level=2,
        name="Screaming into the Void",
        emoji="👻",
        description="Even bots scroll past this. The algorithm pretends you don't exist.",
        min_score=11,
        max_score=20,
        color="slate"
    ),
    ViralityTier(
        level=3,
        name="Mom's Biggest Fan",
        emoji="👩‍👧",
        description="Your mom liked it. That's about it. She's very proud though.",
        min_score=21,
        max_score=30,
        color="zinc"
    ),
    ViralityTier(
        level=4,
        name="Neighborhood Watch",
        emoji="🏘️",
        description="Local legend, global nobody. Your 47 followers are entertained.",
        min_score=31,
        max_score=40,
        color="blue"
    ),
    ViralityTier(
        level=5,
        name="Algorithm's Situationship",
        emoji="💘",
        description="The algorithm sees you... sometimes. It's complicated.",
        min_score=41,
        max_score=50,
        color="indigo"
    ),
    ViralityTier(
        level=6,
        name="Timeline Tickler",
        emoji="🫦",
        description="Causing mild engagement. People are starting to notice you exist.",
        min_score=51,
        max_score=60,
        color="purple"
    ),
    ViralityTier(
        level=7,
        name="Engagement Farmer",
        emoji="🌾",
        description="Working hard for those likes. The grind is paying off.",
        min_score=61,
        max_score=70,
        color="amber"
    ),
    ViralityTier(
        level=8,
        name="Ratio Royalty",
        emoji="👑",
        description="The replies fear you. Your QRTs are devastating.",
        min_score=71,
        max_score=80,
        color="orange"
    ),
    ViralityTier(
        level=9,
        name="Main Character Energy",
        emoji="⭐",
        description="Today's protagonist. Everyone's talking about your post.",
        min_score=81,
        max_score=90,
        color="rose"
    ),
    ViralityTier(
        level=10,
        name="Elon's Fav (God Mode)",
        emoji="🚀",
        description="Congratulations, you broke X. Viral singularity achieved.",
        min_score=91,
        max_score=100,
        color="green"
    ),
]

def get_tier_for_score(score: int) -> ViralityTier:
    """Get the virality tier for a given score (0-100)"""
    score = max(0, min(100, score))  # Clamp to 0-100
    for tier in VIRALITY_TIERS:
        if tier.min_score <= score <= tier.max_score:
            return tier
    return VIRALITY_TIERS[0]  # Default to lowest tier

def get_all_tiers() -> List[dict]:
    """Get all tiers as dictionaries"""
    return [
        {
            "level": t.level,
            "name": t.name,
            "emoji": t.emoji,
            "description": t.description,
            "min_score": t.min_score,
            "max_score": t.max_score,
            "color": t.color
        }
        for t in VIRALITY_TIERS
    ]
