"""
Scope-3 estimator:
- Baseline: feature engineering + LightGBM/RandomForest regression
- Inputs: per-supplier feature table (spend, category, transport_mode, distance_km, qty, unit_weight_kg, known_emissions_flag, etc)
- Output: predicted emissions (kgCO2e) and uncertainty estimate (std from ensemble)
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from lightgbm import LGBMRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from backend.api.ai.utils import save_model, load_model
import joblib

DEFAULT_MODEL_NAME = "scope3_estimator_v1"

def build_pipeline():
    # Example feature groups - adapt to your data
    cat_features = ["category", "transport_mode"]
    num_features = ["quantity", "distance_km", "unit_weight_kg", "spend"]

    cat_pipe = Pipeline([
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse=False))
    ])
    preproc = ColumnTransformer([
        ("cat", cat_pipe, cat_features),
    ], remainder="passthrough")  # numeric features pass through

    model = LGBMRegressor(n_estimators=50, learning_rate=0.05)
    pipe = Pipeline([
        ("preproc", preproc),
        ("model", model)
    ])
    return pipe, cat_features + num_features

def train_scope3(df, target_col="emissions_kgco2e", model_name=DEFAULT_MODEL_NAME):
    """
    df: pandas DataFrame with columns:
      category, transport_mode, quantity, distance_km, unit_weight_kg, spend, emissions_kgco2e (target for supervised training)
    """
    # basic cleaning - fillna
    df = df.copy()
    df.fillna({"distance_km":0, "unit_weight_kg": 0.0, "spend":0.0, "quantity":0}, inplace=True)

    X = df[["category","transport_mode","quantity","distance_km","unit_weight_kg","spend"]]
    y = df[target_col].values

    pipe, feat_order = build_pipeline()
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    pipe.fit(X_train, y_train)
    # save model
    save_model(pipe, model_name)
    preds = pipe.predict(X_val)
    
    preds = np.stack([tree.predict(df) for tree in model.estimators_])
    std_dev = preds.std(axis=0)

    # pipe["predicted_scope3"] = preds
    # pipe["uncertainty"] = std_dev

    mae = np.mean(np.abs(preds - y_val))
    print(f"[scope3] Trained {model_name}, val MAE={mae:.2f} kgCO2e")
    return pipe

def predict_scope3(df_input, model_name=DEFAULT_MODEL_NAME):
    """
    df_input: DataFrame with same features as training X.
    returns DataFrame with columns: predicted_kgco2e, uncertainty_kgco2e (ensemble stdev proxy)
    """
    model = load_model(model_name)
    # If model is an ensemble with native predict_proba/estimators_ we could compute stdev. For LightGBM we can use bagging or use drop_in. We'll approximate via trees
    preds = model.predict(df_input)
    # crude uncertainty proxy: use std over small bootstrap of trees (LightGBM doesn't expose estimators_, so fallback to fixed pct)
    # For demonstration, set uncertainty = 15% of predicted (to be replaced with real quantile model)
    uncertainty = np.maximum(0.05 * preds, 0.15 * preds)  # placeholder
    out = df_input.copy()
    out["predicted_kgco2e"] = preds
    out["uncertainty_kgco2e"] = uncertainty
    return out
