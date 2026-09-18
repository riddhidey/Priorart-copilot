"""
Canonical Statutory Risk & Similarity Classification Utility
Unified contract across Screening Copilot and Global Patent Intelligence Radar.
Statutory Tiers:
  - HIGH: >= 90% (0.90 - 1.00) -> Direct prior-art collision (35 U.S.C. § 102)
  - MOD:  80% - 89% (0.80 - 0.89) -> Analogous domain art (35 U.S.C. § 103)
  - LOW:  < 80% (0.00 - 0.79)   -> Distant reference / safe novelty gap
"""
from typing import Tuple, Union


HIGH_THRESHOLD_PCT = 90
MOD_THRESHOLD_PCT = 80

HIGH_THRESHOLD_FLOAT = 0.90
MOD_THRESHOLD_FLOAT = 0.80


def normalize_threat_level(threat: str) -> str:
    """Normalize arbitrary threat string to canonical 'HIGH' | 'MOD' | 'LOW'."""
    if not threat:
        return "LOW"
    t = str(threat).upper().strip()
    if "HIGH" in t:
        return "HIGH"
    if "MOD" in t or "MEDIUM" in t:
        return "MOD"
    return "LOW"


def classify_risk_score(score: Union[float, int], raw_threat_level: str = "") -> Tuple[str, int]:
    """
    Classify a similarity/novelty risk score into statutory threat tier and integer percentage.
    
    Args:
        score: float between 0.0 and 1.0 (or percentage integer between 0 and 100).
        raw_threat_level: Optional agent-assigned threat level ('high', 'moderate', 'low').

    Returns:
        (canonical_threat_tier, similarity_percentage)
        e.g., ("HIGH", 94), ("MOD", 84), ("LOW", 74)
    """
    # Convert to 0 - 100 percentage integer
    if isinstance(score, float) and score <= 1.0 and score > 0:
        pct = round(score * 100)
    else:
        try:
            pct = int(round(float(score)))
        except (ValueError, TypeError):
            pct = 50

    pct = max(60, min(98, pct))

    # If an explicit agent threat level is provided, honor it and calibrate pct to tier bounds
    normalized_agent_threat = normalize_threat_level(raw_threat_level) if raw_threat_level else None

    if normalized_agent_threat == "HIGH":
        # Strictly >= 90%
        final_pct = max(HIGH_THRESHOLD_PCT, min(97, pct if pct >= HIGH_THRESHOLD_PCT else round(70 + (pct / 100.0) * 28)))
        return ("HIGH", final_pct)
    elif normalized_agent_threat == "MOD":
        # Strictly 80% - 89%
        final_pct = max(MOD_THRESHOLD_PCT, min(HIGH_THRESHOLD_PCT - 1, pct if MOD_THRESHOLD_PCT <= pct < HIGH_THRESHOLD_PCT else round(65 + (pct / 100.0) * 24)))
        return ("MOD", final_pct)
    elif normalized_agent_threat == "LOW":
        # Strictly < 80% (60% - 78%)
        final_pct = max(60, min(MOD_THRESHOLD_PCT - 1, pct if 60 <= pct < MOD_THRESHOLD_PCT else round(60 + (pct / 100.0) * 18)))
        return ("LOW", final_pct)

    # Pure score-based statutory classification (no agent override)
    if pct >= HIGH_THRESHOLD_PCT:
        return ("HIGH", pct)
    elif pct >= MOD_THRESHOLD_PCT:
        return ("MOD", pct)
    else:
        return ("LOW", pct)
