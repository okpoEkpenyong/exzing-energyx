from fastapi import APIRouter
from datetime import datetime
import random

router = APIRouter()

@router.get("/simulate")
def simulate_input():
    return {
        "device_id": "vessel-001",
        "fuel_type": "diesel",
        "fuel_amount": round(random.uniform(500, 2000), 2),
        "timestamp": datetime.utcnow()
    }
