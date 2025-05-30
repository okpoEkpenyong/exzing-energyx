from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend import schemas, models
from backend.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

CO2_FACTORS = {
    "diesel": 2.68,
    "petrol": 2.31
}

@router.post("/", response_model=schemas.EmissionOut)
def log_emission(data: schemas.EmissionIn, db: Session = Depends(get_db)):
    factor = CO2_FACTORS.get(data.fuel_type.lower(), 2.5)
    co2 = data.fuel_amount * factor
    log = models.EmissionLog(
        device_id=data.device_id,
        fuel_type=data.fuel_type,
        fuel_amount=data.fuel_amount,
        co2_emitted=co2
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/", response_model=list[schemas.EmissionOut])
def get_emissions(db: Session = Depends(get_db)):
    return db.query(models.EmissionLog).all()
