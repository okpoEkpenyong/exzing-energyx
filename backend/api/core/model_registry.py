from pathlib import Path
from datetime import datetime
from joblib import dump, load
import json

BASE_PATH = Path("models/scope3")
BASE_PATH.mkdir(parents=True, exist_ok=True)

REGISTRY_FILE = BASE_PATH / "registry.json"


def save_model(model, metrics: dict):
    version = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    model_path = BASE_PATH / f"scope3_{version}.joblib"

    dump(model, model_path)

    record = {
        "version": version,
        "path": str(model_path),
        "metrics": metrics
    }

    if REGISTRY_FILE.exists():
        registry = json.loads(REGISTRY_FILE.read_text())
    else:
        registry = {"models": []}

    registry["models"].append(record)
    REGISTRY_FILE.write_text(json.dumps(registry, indent=2))

    return record


def load_latest_model():
    if not REGISTRY_FILE.exists():
        return None, None

    registry = json.loads(REGISTRY_FILE.read_text())
    if not registry["models"]:
        return None, None

    latest = registry["models"][-1]
    model = load(latest["path"])
    return model, latest


def get_registry():
    if not REGISTRY_FILE.exists():
        return {"models": []}
    return json.loads(REGISTRY_FILE.read_text())
