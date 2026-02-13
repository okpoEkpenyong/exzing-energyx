"""
Credit integrity scoring:
- Lightweight model that scores carbon credits based on metadata features
- This is a placeholder classifier/regression that can be trained with historical registry data + auditor verdicts
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from ai.utils import save_model, load_model

MODEL_NAME = "credit_integrity_v1"

def train_credit_scorer(df, label_col="high_integrity"):
    """
    df with features: project_type, registry, vintage, third_party_verification, social_co-benefits_score, permanence_score
    target label: high_integrity (0/1)
    """
    # simple one-hot encode and train logistic
    X = pd.get_dummies(df.drop(columns=[label_col]), drop_first=True)
    y = df[label_col].values
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    save_model(model, MODEL_NAME)
    print("[credit] trained logistic scorer")
    return model

def score_credit(metadata):
    """
    metadata: dict of credit metadata same columns as trained data (not one-hot encoded)
    """
    model = load_model(MODEL_NAME)
    df = pd.DataFrame([metadata])
    X = pd.get_dummies(df, drop_first=True)
    # align columns (this naive approach assumes same columns - in prod use proper vectorizer)
    # fallback: missing columns -> zeros
    X_cols = model.feature_names_in_ if hasattr(model, "feature_names_in_") else None
    # best-effort; in prod use a preserved vectorizer
    proba = model.predict_proba(X)[0,1]
    return float(proba)
