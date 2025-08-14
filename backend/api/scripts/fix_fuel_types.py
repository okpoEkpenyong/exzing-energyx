# scripts/fix_fuel_types.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.api.db_models import models
from backend.api.database import Base, engine

Session = sessionmaker(bind=engine)
s = Session()

rows = s.query(models.EmissionLog).filter(models.EmissionLog.fuel_type.like('FuelType.%')).all()
for r in rows:
    r.fuel_type = r.fuel_type.replace('FuelType.', '')
    s.add(r)
s.commit()
print(f"Fixed {len(rows)} rows.")
s.close()
