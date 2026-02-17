"""
Training orchestrator for baseline models. Use this to train models locally with labelled dataset(s).
This script contains demo/training flows for each AI component.
"""

import pandas as pd
from ai.scope3_estimator import train_scope3
from ai.anomaly_detector import train_anomaly_detector
from ai.forecast_model import train_forecast
from ai.credit_integrity_scoring import train_credit_scorer

def train_all_demo():
    # Demo training uses sample CSVs from ./data
    # scope3 dataset must include emissions_kgco2e target column
    try:
        df_scope3 = pd.read_csv("./sample_data/scope3_sample.csv")
        train_scope3(df_scope3, target_col="emissions_kgco2e")
    except Exception as e:
        print("scope3 train skipped:", e)

    try:
        df_anon = pd.read_csv("./sample_data/anomaly_sample.csv")
        train_anomaly_detector(df_anon)
    except Exception as e:
        print("anomaly train skipped:", e)

    try:
        series = pd.read_csv("./sample_data/emissions_timeseries.csv")["emissions"]
        train_forecast(series)
    except Exception as e:
        print("forecast train skipped:", e)

    try:
        df_credit = pd.read_csv("./data/credit_metadata.csv")
        train_credit_scorer(df_credit)
    except Exception as e:
        print("credit train skipped:", e)

if __name__ == "__main__":
    train_all_demo()
