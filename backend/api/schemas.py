from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EmissionIn(BaseModel):
    device_id: str
    fuel_type: str
    fuel_amount: float

class EmissionOut(EmissionIn):
    co2_emitted: float
    timestamp: datetime

class CreditOut(BaseModel):
    emission_log_id: int
    credits_awarded: float
    issued_at: datetime
