# backend\api\schemas\predict.py
# confirm it matches the expected request and response formats for the predict endpoints
# and matches the design architecture

from pydantic import BaseModel
from typing import List, Dict, Any

class PredictScope3Request(BaseModel):
    records: List[Dict[str, Any]]

class PredictScope3Response(BaseModel):
    results: List[Dict[str, Any]]

class ScoreAnomalyRequest(BaseModel):
    records: List[Dict[str, Any]]

class ScoreAnomalyResponse(BaseModel):
    results: List[Dict[str, Any]]

class RecommendRequest(BaseModel):
    supplier_summary: List[Dict[str, Any]]

class RecommendResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
