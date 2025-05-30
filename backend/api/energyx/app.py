# from . import routes  # NOQAimport os
import os
from pathlib import Path
import motor.motor_asyncio
from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter
from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor


# Use API_ALLOW_ORIGINS env var with comma separated urls like
# `http://localhost:300, http://otherurl:100`
# Requests coming to the api server from other urls will be rejected as per
# CORS.
allowOrigins = os.environ.get('API_ALLOW_ORIGINS')

# Use API_ENVIRONMENT to change webConfiguration based on this value.
# For example, setting API_ENVIRONMENT=develop disables CORS checking,
# allowing all origins.
environment = os.environ.get('API_ENVIRONMENT')

def originList():
    if environment is not None and environment == "develop":
        print("Allowing requests from any origins. API_ENVIRONMENT=", environment)
        return ["*"]
    
    origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
    ]
    
    if allowOrigins is not None:
        for origin in allowOrigins.split(","):
            print("Allowing requests from", origin, ". To change or disable, go to ", Path(__file__))
            origins.append(origin)
        
    return origins
    
from .models import Settings, __beanie_models__

settings = Settings()
app = FastAPI(
    description="Simple EnergyX API",
    version="2.0.0",
    title="Simple EnergyX API",
    docs_url="/",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=originList(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.APPLICATIONINSIGHTS_CONNECTION_STRING:
    exporter = AzureMonitorTraceExporter.from_connection_string(
        settings.APPLICATIONINSIGHTS_CONNECTION_STRING
    )
    role_name = settings.APPLICATIONINSIGHTS_ROLENAME or ""
    tracerProvider = TracerProvider(
        resource=Resource({SERVICE_NAME: role_name})
    )
    tracerProvider.add_span_processor(BatchSpanProcessor(exporter))

    FastAPIInstrumentor.instrument_app(app, tracer_provider=tracerProvider)


@app.on_event("startup")
async def startup_event():
    client = motor.motor_asyncio.AsyncIOMotorClient(
        settings.AZURE_COSMOS_CONNECTION_STRING
    )
    await init_beanie(
        database=client[settings.AZURE_COSMOS_DATABASE_NAME],
        document_models=__beanie_models__,
    )
