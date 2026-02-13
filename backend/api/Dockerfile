FROM python:3.10
WORKDIR /code
EXPOSE 3100
COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./energyx /code/energyx

CMD ["uvicorn", "energyx.app:app", "--host", "0.0.0.0", "--port", "3100", "--proxy-headers"]


# FROM python:3.10-slim

# WORKDIR /app

# COPY requirements.txt /app/
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . /app

# ENV MODEL_DIR=/app/models
# RUN mkdir -p /app/models

# EXPOSE 8000

# CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]

