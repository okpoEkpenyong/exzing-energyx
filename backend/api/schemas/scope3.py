from pydantic import BaseModel
from typing import List


class TrainResponse(BaseModel):
    version: str
    metrics: dict


class PredictionResponse(BaseModel):
    predictions: List[float]
    model_version: str
    metrics: dict
