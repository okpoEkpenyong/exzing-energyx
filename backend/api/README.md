# Python energyx API


# Exzing–AI Pilot - Production-ready scaffold

## Purpose
This directory contains a production-ready scaffold for the AI components of Exzing–EnergyX:
- Scope-3 estimator (predict missing supplier emissions)
- Anomaly detector for data QA/fraud detection
- Recommender for supplier engagement / reductions
- Forecasting model
- Credit integrity scoring
- MRV corroboration helper for satellite/telemetry

## Quick start (local)
1. Create and activate virtualenv
2. Install dependencies:

## Setup

Requirements:

- Python (3.8+)

```bash
$ pip install -r requirements.txt
```

Or

```bash
$ poetry install
```

## Running

Before running, set the `AZURE_COSMOS_CONNECTION_STRING` environment variable to the connection-string for mongo/cosmos.

Run the following common from the root of the api folder to start the app:

```bash
$ uvicorn energyx.app:app --port 3100 --reload
```

There is also a launch profile in VS Code for debugging.

## Running in Docker

The environment variable AZURE_COSMOS_CONNECTION_STRING must be set and then application runs on TCP 8080:

```bash
docker build . -t fastapi-energyx
docker run --env-file ./src/.env -p 8080:8080 -t fastapi-energyx
```

## Tests

The tests can be run from the command line, or the launch profile in VS Code

```bash
$ pip install -r requirements-test.txt
$ AZURE_COSMOS_DATABASE_NAME=test_db python -m pytest tests/
```

3. Prepare `./data/` with demo CSVs (see ai/train_models.py expectations)
4. Train demos:

python ai/train_models.py

(train models on demo data; in prod replace with real labelled datasets)
5. Run API:

uvicorn api.main:app --reload

6. Call endpoints (see api/schemas.py).

## Production notes
- Use managed Azure Machine Learning or pipelines to train/retrain models on secure datasets.
- Models are stored in `/models` directory; in production use blob storage and model registry.
- Use logging, metrics (Prometheus), and alerting for model drift & data quality issues.
- Secure API behind authentication (Azure AD / OAuth2).




<!--
python ai/train_models.py
This will produce models/*.pkl.
curl -X POST "http://localhost:8000/predict/scope3" -H "Content-Type: application/json" -d '{"records":[{"category":"Steel","transport_mode":"Ship","quantity":50,"distance_km":2000,"unit_weight_kg":100,"spend":50000}] }'


Add example demo CSVs in data/ that match the model expectations so you can run the whole train_models.py without dataset creation.

Provide a monitoring + retraining pipeline (GitHub Actions + Azure ML + model registry).

Integrate this API with the evidence-bundle manifest flow (automatically call upload_artifacts.py, build_manifest.py, and anchor_ledger.py after producing a report).

Create a small React dashboard (preview) to visualize predictions, uncertainties and provide auditor download buttons.
 -->
