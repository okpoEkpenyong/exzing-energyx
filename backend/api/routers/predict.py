# TODO
# backend\api\routers\predict.py

from fastapi import APIRouter, HTTPException
from backend.api.schemas.predict import (
    PredictScope3Request,
    PredictScope3Response,
    ScoreAnomalyRequest,
    ScoreAnomalyResponse,
    RecommendRequest,
    RecommendResponse,
)
# from backend.api.ai.scope3_model import predict_scope3
from backend.api.ai.scope3_estimator import predict_scope3
from backend.api.ai.anomaly_detector import score_anomalies
from backend.api.ai.recommender import generate_recommendations
import pandas as pd

router = APIRouter()


@router.post("/scope3", response_model=PredictScope3Response)
def scope3_prediction(request: PredictScope3Request):
    try:
        df = pd.DataFrame(request.records)
        results = predict_scope3(df)
        return {"results": results.to_dict(orient="records")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/anomaly", response_model=ScoreAnomalyResponse)
def anomaly_detection(request: ScoreAnomalyRequest):
    try:
        df = pd.DataFrame(request.records)
        results = score_anomalies(df)
        return {"results": results.to_dict(orient="records")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest):
    try:
        df = pd.DataFrame(request.supplier_summary)
        recs = generate_recommendations(df)
        return {"recommendations": recs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
