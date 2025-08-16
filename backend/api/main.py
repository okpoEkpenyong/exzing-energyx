# backend/api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routers import emissions, credits, devices, health, items
from backend.api.database import create_db_and_tables
from backend.api.routers import metrics
import os



app = FastAPI(title="Exzing EnergyX Carbon Intelligence Platform", version="1.0")

allowOrigins = os.environ.get('API_ALLOW_ORIGINS')

environment = os.environ.get('API_ENVIRONMENT')

def originList():
    if environment is not None and environment == "develop":
        print("Allowing requests from any origins. API_ENVIRONMENT=", environment)
        return ["*"]
    
    origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
        "https://exzing-energyx.onrender.com",
        "https://energyx.exzing.com",
        "https://www.exzing.com",
        "https://exzing-energyx.vercel.app",
        "https://vercel.com",
        "https://domain.com",
    ]


    
    if allowOrigins is not None:
        for origin in allowOrigins.split(","):
            print("Allowing requests from", origin)
            origins.append(origin)
        
    return origins

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=originList(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(emissions.router, prefix="/emissions", tags=["Emissions"])
app.include_router(credits.router, prefix="/credits", tags=["Carbon Credits"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(health.router)
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])


@app.on_event("startup")
def on_startup():
    # ensure DB models are imported and tables created
    create_db_and_tables()


@app.get("/")
def root():
    return {"message": "Carbon Intelligence Platform is running"}