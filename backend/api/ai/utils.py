import os
import joblib
from pathlib import Path

MODEL_DIR = Path(os.environ.get("MODEL_DIR", "models"))
MODEL_DIR.mkdir(parents=True, exist_ok=True)

def save_model(obj, name):
    path = MODEL_DIR / f"{name}.pkl"
    joblib.dump(obj, path)
    return str(path)

def load_model(name):
    path = MODEL_DIR / f"{name}.pkl"
    if not path.exists():
        raise FileNotFoundError(f"Model {name} not found at {path}")
    return joblib.load(path)
