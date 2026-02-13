# backend\api\ai\anomaly_detector.py

"""
Simple anomaly/fraud detection on timeseries or tabular supplier reports.
Uses IsolationForest to score unusual submissions.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
# from ai.utils import save_model, load_model
from backend.api.ai.utils import save_model, load_model


MODEL_NAME = "anomaly_iforest_v1"

def train_anomaly_detector(X, model_name=MODEL_NAME):
    """
    X: numeric DataFrame - features representing sample submissions, e.g. reported_emissions, variance, reporting_count, supplier_age, etc
    """
    model = IsolationForest(n_estimators=200, contamination=0.02, random_state=42)
    model.fit(X)
    save_model(model, model_name)
    print("[anomaly] trained isolation forest")
    return model

def score_anomalies(X, model_name=MODEL_NAME):
    model = load_model(model_name)
    scores = model.decision_function(X)  # higher = normal, lower = anomaly
    is_anomaly = model.predict(X)  # -1 anomaly, 1 normal
    out = X.copy()
    out["anomaly_score"] = -scores  # flip so higher means more anomalous
    out["is_anomaly"] = (is_anomaly == -1)
    return out
