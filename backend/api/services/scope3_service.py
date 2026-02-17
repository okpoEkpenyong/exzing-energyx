import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

from backend.api.core.model_registry import save_model, load_latest_model


FEATURES = [
    "category",
    "transport_mode",
    "quantity",
    "distance_km",
    "unit_weight_kg",
    "spend"
]


class Scope3Service:

    def train(self, df: pd.DataFrame):
        df = df.copy()

        # Basic encoding
        df = pd.get_dummies(df, columns=["category", "transport_mode"])

        X = df.drop(columns=["target"])
        y = df["target"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = RandomForestRegressor(n_estimators=20)
        model.fit(X_train, y_train)

        preds = model.predict(X_test)

        metrics = {
            "r2": float(r2_score(y_test, preds)),
            "mae": float(mean_absolute_error(y_test, preds))
        }

        record = save_model(model, metrics)

        return record

    def predict(self, df: pd.DataFrame):
        model, metadata = load_latest_model()

        if model is None:
            raise Exception("No trained model found")

        df = pd.get_dummies(df)

        preds = model.predict(df)

        return {
            "predictions": preds.tolist(),
            "model_version": metadata["version"],
            "metrics": metadata["metrics"]
        }
