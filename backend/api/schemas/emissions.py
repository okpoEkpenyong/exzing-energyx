# backend\api\schemas\emissions.py

# backend/api/schemas/emissions.py
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from enum import Enum

class CommonBaseModel(BaseModel):
    class Config:
        orm_mode = True

class FuelType(str, Enum):
    diesel = "diesel"
    petrol = "petrol"
    lng = "lng"
    cng = "cng"
    electric = "electric"
    hybrid = "hybrid"

# Shared properties
class EmissionBase(CommonBaseModel):
    device_id: str = Field(..., example="vessel-001")
    fuel_type: FuelType = Field(..., example="diesel")
    fuel_amount: float = Field(..., gt=0, example=1200.5)
    notes: Optional[str] = Field(None, example="Routine bunkering")

# For POST request body (allow timestamp override)
class EmissionCreate(EmissionBase):
    timestamp: Optional[datetime] = None

# For responses
class EmissionOut(EmissionBase):
    id: int
    co2_emitted: float
    timestamp: datetime

    @validator("fuel_type", pre=True)
    def _coerce_fuel_type(cls, v):
        # if already an enum, return it
        if isinstance(v, FuelType):
            return v
        # if string like "FuelType.diesel", take last token
        if isinstance(v, str):
            v_clean = v.strip()
            if "." in v_clean:
                v_clean = v_clean.split(".")[-1]
            # try to coerce to enum; if invalid, raise to let Pydantic show error
            try:
                return FuelType(v_clean)
            except ValueError:
                # fallback: let Pydantic raise a clearer error by returning the raw string
                return v_clean
        return v


# Paginated list
class EmissionList(CommonBaseModel):
    total: int
    page: int
    per_page: int
    items: List[EmissionOut]
