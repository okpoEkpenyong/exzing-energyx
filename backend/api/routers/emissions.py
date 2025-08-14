# backend\api\routers\emissions.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from backend.api.schemas import emissions as schemas
from backend.api.db_models import models
from backend.api.deps import get_db
from typing import List

router = APIRouter()

CO2_FACTORS = {
    "diesel": 2.68,
    "petrol": 2.31,
    "lng": 3.0  # example
}

@router.post("/", response_model=schemas.EmissionOut)
def log_emission(data: schemas.EmissionCreate, db: Session = Depends(get_db)):
    
    fuel_type_value = data.fuel_type.value if hasattr(data.fuel_type, "value") else str(data.fuel_type)

    factor = CO2_FACTORS.get(fuel_type_value, 2.5)
    co2 = data.fuel_amount * factor
    
    # factor = CO2_FACTORS.get(data.fuel_type.value if hasattr(data.fuel_type, "value") else data.fuel_type, 2.5)
    # co2 = data.fuel_amount * factor
    
    log = models.EmissionLog(
        device_id=data.device_id,
        fuel_type=fuel_type_value,
        fuel_amount=data.fuel_amount,
        co2_emitted=co2,
    )
    # allow timestamp override
    if data.timestamp:
        object.__setattr__(log, "timestamp", data.timestamp)

    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/", response_model=schemas.EmissionList)
def get_emissions(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=500),
    fuel_type: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
):
    query = db.query(models.EmissionLog)

    if fuel_type:
        query = query.filter(models.EmissionLog.fuel_type == fuel_type.lower())

    if start:
        query = query.filter(models.EmissionLog.timestamp >= start)
    if end:
        query = query.filter(models.EmissionLog.timestamp <= end)

    total = query.count()
    items = query.order_by(models.EmissionLog.timestamp.desc()) \
                 .offset((page - 1) * per_page).limit(per_page).all()

    # Convert ORM -> Pydantic explicitly (type-safe)
    pydantic_items: List[schemas.EmissionOut] = [schemas.EmissionOut.from_orm(i) for i in items]

    return schemas.EmissionList(total=total, page=page, per_page=per_page, items=pydantic_items)
@router.get("/{emission_id}", response_model=schemas.EmissionOut)
def get_emission(emission_id: int, db: Session = Depends(get_db)):
    e = db.query(models.EmissionLog).filter(models.EmissionLog.id == emission_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Emission not found")
    return e
