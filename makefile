# Makefile for local development (Windows-friendly, using Yarn)
.PHONY: dev backend frontend

dev: backend frontend

backend:
	cd backend/api && \
	python -m venv .venv && \
	.venv\Scripts\activate && \
	python -m pip install --upgrade pip && \
	python -m pip install -r requirements.txt && \
	start powershell -Command ".venv\Scripts\activate; uvicorn main:app --reload --host 0.0.0.0 --port 5000"

frontend:
	cd frontend/web && \
	yarn install && \
	echo VITE_API_BASE_URL=http://localhost:5000 > .env.local && \
	yarn dev
