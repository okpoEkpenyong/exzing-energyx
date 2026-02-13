"""
Simple recommendation engine:
- Rule-based actions + ML model for impact estimation
- Example calls:
    generate_recommendations(supplier_summary_df)
"""

import pandas as pd
import numpy as np

def generate_recommendations(supplier_df, top_n=5):
    """
    supplier_df expected columns: supplier, emissions_tco2e, data_quality_tier, category
    Returns recommended actions sorted by potential impact.
    """
    recs = []
    # Rule 1: largest emitters first
    df = supplier_df.sort_values("emissions_tco2e", ascending=False).reset_index(drop=True)
    for i, row in df.iterrows():
        supplier = row["supplier"]
        emis = row["emissions_tco2e"]
        quality = row.get("data_quality_tier", "TIER-2")
        cat = row.get("category", "unknown")
        # Suggest supplier engagement if Tier-2 (improve data)
        if quality == "TIER-2":
            recs.append({
                "supplier": supplier,
                "action": "Supplier engagement: data disclosure & measurement",
                "estimated_impact_tco2e": emis * 0.20,  # assume 20% reduction possible with engagement
                "confidence": 0.5
            })
        else:
            recs.append({
                "supplier": supplier,
                "action": "Operational optimisation / fuel substitution",
                "estimated_impact_tco2e": emis * 0.25,
                "confidence": 0.6
            })
        if len(recs) >= top_n:
            break
    return pd.DataFrame(recs)
