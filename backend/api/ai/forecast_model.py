"""
Simple forecasting module for short-term emissions forecasting.
Baseline: use RandomForestRegressor on lag features.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from ai.utils import save_model, load_model

MODEL_NAME = "forecast_rf_v1"

def create_lag_features(series, lags=6):
    df = pd.DataFrame({"y": series})
    for lag in range(1, lags+1):
        df[f"lag_{lag}"] = df["y"].shift(lag)
    df.dropna(inplace=True)
    return df

def train_forecast(series, model_name=MODEL_NAME):
    df = create_lag_features(series)
    X = df[[c for c in df.columns if c.startswith("lag_")]]
    y = df["y"]
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X, y)
    save_model(model, model_name)
    print("[forecast] trained random forest forecast model")
    return model

def predict_forecast(series, steps=6, model_name=MODEL_NAME):
    model = load_model(model_name)
    recent = series[-6:].tolist()
    preds = []
    for _ in range(steps):
        X = np.array(recent[-6:]).reshape(1, -1)
        p = model.predict(X)[0]
        preds.append(p)
        recent.append(p)
    return preds
