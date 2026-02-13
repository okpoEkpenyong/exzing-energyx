"""
IoT / Satellite MRV stub.
- In production you'd use specialized APIs (e.g., SentinelHub, GHGSat, or vendor services).
- This module shows how you can combine telemetry and remote sensing indicators into a simple corroboration score.
"""

import pandas as pd
import numpy as np

def compute_corroboration_score(telemetry_df=None, satellite_signals=None):
    """
    telemetry_df: DataFrame of telemetry (fuel_rate, speed, km) aggregated per asset
    satellite_signals: dict e.g. {"flaring_index": x, "thermal_anomaly": y}
    Returns: corroboration_score in [0,1], higher -> better corroboration
    """
    score = 0.5
    if telemetry_df is not None and not telemetry_df.empty:
        # basic heuristics: presence of telemetry increases confidence
        score += 0.25
        # if telemetry values align with expected ranges, increase more
    if satellite_signals:
        # presence of corroborating signals increases confidence
        score += 0.25 * min(1.0, sum(satellite_signals.values()) / (len(satellite_signals) + 1))
    return min(1.0, score)
