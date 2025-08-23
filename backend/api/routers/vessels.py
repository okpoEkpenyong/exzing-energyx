# backend/api/routers/vessels.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.api.database import SessionLocal
from backend.api.db_models import models
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/vessels", tags=["Vessels"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class VesselIn(BaseModel):
    name: str
    imo: str | None = None
    fuel_type: str | None = None
    dwt: float | None = None
    engine_kw: float | None = None

class VesselOut(VesselIn):
    id: int

@router.get("/", response_model=List[VesselOut])
def list_vessels(db: Session = Depends(get_db)):
    rows = db.query(models.Vessel).all()
    return [VesselOut(id=r.id, name=r.name, imo=r.imo, fuel_type=r.fuel_type, dwt=r.dwt, engine_kw=r.engine_kw) for r in rows]

@router.post("/", response_model=VesselOut)
def create_vessel(payload: VesselIn, db: Session = Depends(get_db)):
    v = models.Vessel(name=payload.name, imo=payload.imo, fuel_type=payload.fuel_type, dwt=payload.dwt, engine_kw=payload.engine_kw)
    db.add(v)
    db.commit()
    db.refresh(v)
    return VesselOut(id=v.id, name=v.name, imo=v.imo, fuel_type=v.fuel_type, dwt=v.dwt, engine_kw=v.engine_kw)
