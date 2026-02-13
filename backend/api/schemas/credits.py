
# backend/api/schemas/credits.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.api.schemas.emissions import EmissionOut  # ok to import here

class CommonBaseModel(BaseModel):
    class Config:
        orm_mode = True

class CreditBase(CommonBaseModel):
    emission_log_id: int
    credits_awarded: float

class CreditOut(CreditBase):
    id: int
    issued_at: datetime
    emission: Optional[EmissionOut] = None  # optional embedded emission details

