from fastapi import APIRouter, UploadFile, File
import pandas as pd
from backend.api.services.scope3_service import Scope3Service

router = APIRouter()
service = Scope3Service()


@router.post("/train")
async def train_scope3(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    record = service.train(df)

    return {
        "version": record["version"],
        "metrics": record["metrics"]
    }


@router.post("/predict")
async def predict_scope3(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    result = service.predict(df)
    return result


@router.get("/model-status")
def model_status():
    from app.core.model_registry import get_registry
    registry = get_registry()

    return {
        "models_trained": len(registry["models"]),
        "latest_model": registry["models"][-1] if registry["models"] else None
    }
